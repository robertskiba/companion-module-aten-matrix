import { InstanceBase, InstanceStatus, TelnetHelper } from '@companion-module/base'
import { getActions } from './actions.js'
import { getFeedbacks } from './feedbacks.js'
import { getVariableDefinitions, getVariableValues } from './variables.js'
import { ConfigFields } from './config.js'
import { UpgradeScripts } from './upgrades.js'
import { getDeviceSize, pad2 } from './utils.js'

export { UpgradeScripts }

export default class AtenMatrixInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config
		this.outputs = [] // index is output number, value is input routed to it
		this.state = {
			selectedSource: undefined, // input picked via "Select source for take"
			selectedDestination: undefined, // output picked via "Select destination for take"
		}
		this.login = false
		this.lastPreset = undefined // last preset number recalled via the Recall Preset action
		this.firmwareVersion = undefined
		this.pollTime = 15 // re-poll the full routing status this often, as a safety net on top
		// of the instant "Switch input X to output Y" notifications the matrix already pushes
		this.pollInterval = null

		this.setActionDefinitions(getActions(this))
		this.initFeedbacks()
		this.initVariables()

		await this.configUpdated(config)
	}

	getConfigFields() {
		return ConfigFields
	}

	// Send telnet command
	sendCmd(cmd) {
		if (cmd != undefined && cmd != '') {
			if (this.socket === undefined || !this.socket.isConnected) {
				this.log('warn', `Not connected to matrix, cannot send command: ${cmd}`)
				return
			}
			this.log('debug', `Sending command to matrix: ${cmd}`)
			this.socket.send(cmd + '\r\n')
		}
	}

	// Route an input to an output
	route(input, output) {
		this.sendCmd(`SS ${pad2(input)},${pad2(output)}`)
	}

	// Clean up instance before it is destroyed
	async destroy() {
		if (this.socket !== undefined) {
			this.socket.destroy()
		}

		this.stopPolling()

		this.log('debug', `DESTROY ${this.id}`)
	}

	// Initialise the Telnet socket
	initTCP() {
		var receivebuffer = ''

		if (this.socket !== undefined) {
			this.socket.destroy()
			delete this.socket

			this.setLoggedIn(false)
		}

		this.stopPolling()

		if (!this.config.host) {
			this.updateStatus(InstanceStatus.BadConfig, 'No target IP configured')
			return
		}

		if (!this.config.port) {
			this.config.port = 23
		}

		this.updateStatus(InstanceStatus.Connecting)
		this.log('info', 'Connecting to ATEN')

		this.socket = new TelnetHelper(this.config.host, this.config.port)

		this.socket.on('error', (err) => {
			this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
			this.log('error', 'Network error: ' + err.message)
			this.setLoggedIn(false)
		})

		this.socket.on('connect', () => {
			this.updateStatus(InstanceStatus.Connecting)
			this.log('info', 'Connected')
			this.setLoggedIn(false)
		})

		this.socket.on('end', () => {
			this.log('info', 'Disconnected')
			this.updateStatus(InstanceStatus.Disconnected)
			this.stopPolling()
			this.setLoggedIn(false)
		})

		this.socket.on('data', (chunk) => {
			var i = 0,
				line = '',
				offset = 0
			receivebuffer += chunk

			// Split up Lines with new line and Process
			while ((i = receivebuffer.indexOf('\r\n', offset)) !== -1) {
				line = receivebuffer.slice(offset, i)
				offset = i + 1
				this.processLine(line.toString('utf8'))
			}
			receivebuffer = receivebuffer.slice(offset)

			// Handle Login Prompts. The buffer is cleared after acting on a prompt so a
			// stale, unterminated prompt string can't keep re-matching on later chunks
			// (which would otherwise re-send the credentials on every subsequent event).
			if (receivebuffer.match(/Enter Username:/)) {
				this.setLoggedIn(false)
				this.updateStatus(InstanceStatus.Connecting, 'logging in')
				this.log('info', 'Entering Username')
				this.socket.send(this.config.user + '\r\n')
				receivebuffer = ''
			} else if (this.login === false && receivebuffer.match(/Password:/)) {
				this.socket.send(this.config.pass + '\r\n')
				this.log('info', 'Entering Password')
				receivebuffer = ''
			}
		})
	}

	// Track the login state and keep the 'connected' feedback in sync with it
	setLoggedIn(loggedIn) {
		if (this.login === loggedIn) return
		this.login = loggedIn
		this.checkFeedbacks('connected')
	}

	startPolling() {
		this.stopPolling()
		this.pollInterval = setInterval(this.pollOutputs.bind(this), this.pollTime * 1000)
	}

	stopPolling() {
		if (this.pollInterval) {
			clearInterval(this.pollInterval)
			this.pollInterval = null
		}
	}

	// Processes lines received
	processLine(data) {
		if (this.login === false && data.match(/is established/)) {
			// Successful Login
			this.setLoggedIn(true)
			this.updateStatus(InstanceStatus.Ok, 'Logged in')
			this.log('info', 'ATEN Logged in')
			this.sendCmd('VR')
			this.pollOutputs()
			this.startPolling()
		} else if (data.match(/Incorrect/) || data.match(/User login fail/)) {
			this.setLoggedIn(false)
			this.updateStatus(InstanceStatus.AuthenticationFailure, 'Incorrect user/pass')
			this.log('error', 'Incorrect username or password')
		} else if (data.match(/Switch/)) {
			// Matrix Informing after Switch event
			this.processSwitch(data)
		} else if (data.match(/is connected to input port/i)) {
			// Matrix Informing after query
			this.processRoute(data)
		} else if (data.match(/Software version/i)) {
			// Reply to VR
			this.processVersion(data)
		} else if (data.match(/Load/)) {
			// Matrix informing after Load Profile
			this.pollOutputs()
		}
	}

	// Processes response from Matrix after a switch has been made
	processSwitch(data) {
		var regex = /Switch input (\d*) to output (\d*)/gm
		var result = regex.exec(data)

		if (result !== null && result.length >= 3) {
			let src = parseInt(result[1], 10)
			let dst = parseInt(result[2], 10)
			this.outputs[dst] = src
			this.checkFeedbacks('route')
			this.updateVariableValues()
		} else {
			this.log('warn', 'Unknown in processSwitch Regex got: ' + data)
		}
	}

	// Process response from Matrix after polling
	// The matrix replies to "RO <input>" with "Output port <dst> is connected to input port <input>"
	// (output comes first in the sentence - the reverse of the "Switch input X to output Y" wording)
	processRoute(data) {
		var regex = /Output port (\d*) is connected to input port (\d*)/i
		var result = regex.exec(data)

		if (result !== null && result.length >= 3) {
			let dst = parseInt(result[1], 10)
			let src = parseInt(result[2], 10)
			this.outputs[dst] = src
			this.checkFeedbacks('route')
			this.updateVariableValues()
		} else {
			this.log('warn', 'Unknown in processRoute Regex got: ' + data)
		}
	}

	// Process the reply to VR, e.g. "Software version 1.0."
	processVersion(data) {
		var result = /Software version\s*([\d.]*\d)/i.exec(data)

		if (result !== null) {
			this.firmwareVersion = result[1]
			this.updateVariableValues()
		}
	}

	// Poll the matrix for all routes to outputs.
	// "RO n" asks the matrix which output the given INPUT is routed to, so this has
	// to loop over the input ports, not the outputs, to discover every active route.
	pollOutputs() {
		if (this.socket === undefined || !this.socket.isConnected || this.login !== true) {
			this.log('warn', 'Not connected to matrix, cannot poll routing status')
			return
		}

		this.log('debug', 'Polling matrix outputs')
		let { inputs } = getDeviceSize(this.config)
		for (let i = 1; i <= inputs; i++) {
			this.socket.send(`RO ${i}\r\n`)
		}
	}

	// Define feedbacks
	initFeedbacks() {
		this.setFeedbackDefinitions(getFeedbacks(this))
	}

	// Define variables and populate their initial values
	initVariables() {
		this.setVariableDefinitions(getVariableDefinitions(this))
		this.updateVariableValues()
	}

	// Push the currently known state into the variable values
	updateVariableValues() {
		this.setVariableValues(getVariableValues(this))
	}

	// On Config changes apply new config
	async configUpdated(config) {
		var resetConnection = false

		if (this.config != config) {
			resetConnection = true
		}

		this.config = config

		this.outputs = []
		this.setActionDefinitions(getActions(this))
		this.initFeedbacks()
		this.initVariables()

		if (resetConnection === true || this.socket === undefined) {
			this.initTCP()
		}
	}
}
