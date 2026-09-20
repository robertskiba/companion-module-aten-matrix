import { getDeviceSize } from './utils.js'

export function getVariableDefinitions(instance) {
	let { outputs } = getDeviceSize(instance.config)

	const variables = {
		last_preset: { name: 'Last preset recalled via Companion' },
		firmware_version: { name: 'Matrix software version' },
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
	}
	for (let output = 1; output <= outputs; output++) {
		values[`source_O${output}`] = instance.outputs[output] ?? ''
	}
	return values
}
