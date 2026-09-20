import { getInputChoices, getOutputChoices, getPresetChoices, pad2 } from './utils.js'

export function getActions(instance) {
	const inputChoices = getInputChoices(instance.config)
	const outputChoices = getOutputChoices(instance.config)
	const presetChoices = getPresetChoices(instance.config)

	return {
		xpt: {
			name: 'XP:Switch - Select video input for output',
			options: [
				{
					type: 'dropdown',
					label: 'Input',
					id: 'input',
					default: 1,
					choices: inputChoices,
				},
				{
					type: 'dropdown',
					label: 'Output',
					id: 'output',
					default: 1,
					choices: outputChoices,
				},
			],
			callback: async (action) => {
				instance.route(action.options.input, action.options.output)
			},
		},
		selectSource: {
			name: 'Select source for take',
			options: [
				{
					type: 'dropdown',
					label: 'Input',
					id: 'port',
					default: 1,
					choices: inputChoices,
				},
			],
			callback: async (action) => {
				instance.state.selectedSource = action.options.port
				instance.checkFeedbacks('sourceSelected', 'route')
			},
		},
		selectDestination: {
			name: 'Select destination for take',
			options: [
				{
					type: 'dropdown',
					label: 'Output',
					id: 'port',
					default: 1,
					choices: outputChoices,
				},
			],
			callback: async (action) => {
				instance.state.selectedDestination = action.options.port
				instance.checkFeedbacks('destinationSelected', 'route')
			},
		},
		takeSalvo: {
			name: 'Route selected ports',
			options: [],
			callback: async () => {
				const { selectedSource, selectedDestination } = instance.state
				if (selectedSource === undefined || selectedDestination === undefined) {
					instance.log('warn', 'Take: no source and/or destination selected')
					return
				}
				instance.route(selectedSource, selectedDestination)
			},
		},
		preset: {
			name: 'Recall Preset',
			options: [
				{
					type: 'dropdown',
					label: 'Preset',
					id: 'preset',
					default: 1,
					choices: presetChoices,
				},
			],
			callback: async (action) => {
				instance.sendCmd(`LO ${pad2(action.options.preset)}`)

				instance.lastPreset = action.options.preset
				instance.checkFeedbacks('presetRecalled')
				instance.updateVariableValues()
			},
		},
		savePreset: {
			name: 'Save Preset',
			options: [
				{
					type: 'dropdown',
					label: 'Preset',
					id: 'preset',
					default: 1,
					choices: presetChoices,
				},
			],
			callback: async (action) => {
				instance.sendCmd(`SV ${pad2(action.options.preset)}`)
			},
		},
		refresh: {
			name: 'Refresh routing status',
			options: [],
			callback: async () => {
				instance.pollOutputs()
			},
		},
	}
}
