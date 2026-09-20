import { combineRgb } from '@companion-module/base'

export function getFeedbacks(instance) {
	let maxIO = parseInt(instance.config.device, 10)

	const feedbackDefinitions = {
		output_bg: {
			name: 'Crosspoint set',
			type: 'boolean',
			description: 'Triggers if the input specified is in use by the output specified.',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(255, 0, 0),
			},
			options: [
				{
					type: 'number',
					label: 'Input',
					id: 'input',
					default: 1,
					min: 1,
					max: maxIO,
				},
				{
					type: 'number',
					label: 'Output',
					id: 'output',
					default: 1,
					min: 1,
					max: maxIO,
				},
			],
			callback: (feedback) => {
				return instance.outputs[feedback.options.output] === feedback.options.input
			},
		},
	}
	return feedbackDefinitions
}
