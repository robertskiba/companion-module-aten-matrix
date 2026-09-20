import { getDeviceSize } from './utils.js'

export function getVariableDefinitions(instance) {
	let { outputs } = getDeviceSize(instance.config)

	const variables = {
		last_preset: { name: 'Last preset recalled via Companion' },
		firmware_version: { name: 'Matrix software version' },
		selected_source: { name: 'Input selected for take' },
		selected_destination: { name: 'Output selected for take' },
	}
	for (let output = 1; output <= outputs; output++) {
		variables[`source_O${output}`] = {
			name: `Input routed to output ${output}`,
		}
	}
	return variables
}

export function getVariableValues(instance) {
	let { outputs } = getDeviceSize(instance.config)

	const values = {
		last_preset: instance.lastPreset ?? '',
		firmware_version: instance.firmwareVersion ?? '',
		selected_source: instance.state.selectedSource ?? '',
		selected_destination: instance.state.selectedDestination ?? '',
	}
	for (let output = 1; output <= outputs; output++) {
		values[`source_O${output}`] = instance.outputs[output] ?? ''
	}
	return values
}
