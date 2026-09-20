import { combineRgb } from '@companion-module/base'
import { getDeviceSize } from './utils.js'

const WHITE = combineRgb(255, 255, 255)
const BLACK = combineRgb(0, 0, 0)
const DARK_GREY = combineRgb(30, 30, 30)
const GREEN = combineRgb(0, 204, 0)
const RED = combineRgb(204, 0, 0)
const BLUE = combineRgb(0, 102, 204)
const DARK_RED = combineRgb(102, 0, 0)

export function getPresetDefinitions(instance) {
	let { inputs, outputs } = getDeviceSize(instance.config)
	let maxPreset = inputs + outputs
	let label = instance.label

	const presets = {}
	const inputIds = []
	const outputIds = []
	const presetIds = []

	for (let input = 1; input <= inputs; input++) {
		const id = `select_input_${input}`
		presets[id] = {
			type: 'simple',
			name: `Select Input ${input}`,
			style: {
				text: `Input ${input}`,
				size: '18',
				color: WHITE,
				bgcolor: DARK_GREY,
			},
			steps: [
				{
					down: [{ actionId: 'selectSource', options: { port: input } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'sourceSelected',
					options: { port: input },
					style: { bgcolor: GREEN, color: BLACK },
				},
			],
		}
		inputIds.push(id)
	}

	for (let output = 1; output <= outputs; output++) {
		const id = `select_output_${output}`
		presets[id] = {
			type: 'simple',
			name: `Select Output ${output}`,
			style: {
				text: `Output ${output}\nIN $(${label}:source_O${output})`,
				size: '14',
				color: WHITE,
				bgcolor: DARK_GREY,
			},
			steps: [
				{
					down: [{ actionId: 'selectDestination', options: { port: output } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'destinationSelected',
					options: { port: output },
					style: { bgcolor: GREEN, color: BLACK },
				},
			],
		}
		outputIds.push(id)
	}

	presets.take = {
		type: 'simple',
		name: 'Take',
		style: {
			text: `Take\nI$(${label}:selected_source) > O$(${label}:selected_destination)`,
			size: '14',
			color: WHITE,
			bgcolor: DARK_RED,
		},
		steps: [
			{
				down: [{ actionId: 'takeSalvo', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	for (let preset = 1; preset <= maxPreset; preset++) {
		const id = `recall_preset_${preset}`
		presets[id] = {
			type: 'simple',
			name: `Recall Preset ${preset}`,
			style: {
				text: `Preset ${preset}`,
				size: '18',
				color: WHITE,
				bgcolor: DARK_GREY,
			},
			steps: [
				{
					down: [{ actionId: 'preset', options: { preset } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'presetRecalled',
					options: { preset },
					style: { bgcolor: BLUE, color: WHITE },
				},
			],
		}
		presetIds.push(id)
	}

	presets.connected = {
		type: 'simple',
		name: 'Connected',
		style: {
			text: 'Connected',
			size: '14',
			color: WHITE,
			bgcolor: RED,
		},
		steps: [{ down: [], up: [] }],
		feedbacks: [
			{
				feedbackId: 'connected',
				options: {},
				style: { bgcolor: GREEN, color: BLACK },
			},
		],
	}

	const sections = [
		{ id: 'inputs', name: 'Select Input', definitions: inputIds },
		{ id: 'outputs', name: 'Select Output', definitions: outputIds },
		{ id: 'take', name: 'Take', definitions: ['take'] },
		{ id: 'presets', name: 'Presets', definitions: presetIds },
		{ id: 'status', name: 'Status', definitions: ['connected'] },
	]

	return { sections, presets }
}
