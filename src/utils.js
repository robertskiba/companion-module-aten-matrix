// The 'device' config value is either a plain number (legacy, pre-asymmetric-matrix
// configs, upgraded to "NxN" by the upgrade script) or an "inputs x outputs" string
// such as "8x4". This normalizes either form into the actual port counts.
export function getDeviceSize(config) {
	let device = String(config.device ?? '')
	let [inputs, outputs] = device.split('x').map((n) => parseInt(n, 10))

	if (isNaN(outputs)) {
		outputs = inputs
	}

	return { inputs, outputs }
}

function numberedChoices(count, label) {
	const choices = []
	for (let i = 1; i <= count; i++) {
		choices.push({ id: i, label: `${label} ${i}` })
	}
	return choices
}

export function getInputChoices(config) {
	return numberedChoices(getDeviceSize(config).inputs, 'Input')
}

export function getOutputChoices(config) {
	return numberedChoices(getDeviceSize(config).outputs, 'Output')
}

// The matrix numbers its profiles P1..P(inputs+outputs): the input pushbuttons map to
// the first half, the output pushbuttons to the second half.
export function getPresetChoices(config) {
	let { inputs, outputs } = getDeviceSize(config)
	return numberedChoices(inputs + outputs, 'Preset')
}

// The matrix expects port and profile numbers as two-digit, zero-padded strings.
export function pad2(n) {
	return String(n).padStart(2, '0')
}
