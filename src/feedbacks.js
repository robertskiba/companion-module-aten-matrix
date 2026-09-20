import { combineRgb } from '@companion-module/base'
import { getDeviceSize } from './utils.js'

export function getFeedbacks(instance) {
	let { inputs, outputs } = getDeviceSize(instance.config)

	return {
		route: {
			name: 'Route',
			type: 'boolean',
			description: 'Shows if an input is routed to an output',
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 0, 0),
			},
			options: [
				{
					type: 'number',
					label: 'Input',
					id: 'input',
					tooltip: '0 = selected',
					default: 1,
					min: 0,
					max: inputs,
				},
				{
					type: 'number',
					label: 'Output',
					id: 'output',
					tooltip: '0 = selected',
					default: 1,
					min: 0,
					max: outputs,
				},
			],
			callback: (feedback) => {
				let input = feedback.options.input
				let output = feedback.options.output
				if (input === 0) input = instance.state.selectedSource
				if (output === 0) output = instance.state.selectedDestination
				if (input === undefined || output === undefined) return false

				return instance.outputs[output] === input
			},
		},
		sourceSelected: {
			name: 'Source selected',
			type: 'boolean',
			description: 'Shows if an input is selected for routing',
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(0, 255, 0),
			},
			options: [
				{
					type: 'number',
					label: 'Input',
					id: 'port',
					default: 1,
					min: 1,
					max: inputs,
				},
			],
			callback: (feedback) => {
				return instance.state.selectedSource === feedback.options.port
			},
		},
		destinationSelected: {
			name: 'Destination selected',
			type: 'boolean',
			description: 'Shows if an output is selected for routing',
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(0, 255, 0),
			},
			options: [
				{
					type: 'number',
					label: 'Output',
					id: 'port',
					default: 1,
					min: 1,
					max: outputs,
				},
			],
			callback: (feedback) => {
				return instance.state.selectedDestination === feedback.options.port
			},
		},
		presetRecalled: {
			name: 'Preset recalled',
			type: 'boolean',
			description:
				'Shows if the given preset was the last one recalled via Companion. Presets recalled from the front panel, web UI or another controller are not reflected.',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 102, 204),
			},
			options: [
				{
					type: 'number',
					label: 'Preset',
					id: 'preset',
					default: 1,
					min: 1,
					max: inputs + outputs,
				},
			],
			callback: (feedback) => {
				return instance.lastPreset === feedback.options.preset
			},
		},
		connected: {
			name: 'Connected',
			type: 'boolean',
			description: 'Shows if the module has an active, logged-in Telnet session with the matrix',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 204, 0),
			},
			options: [],
			callback: () => {
				return instance.login === true
			},
		},
	}
}
