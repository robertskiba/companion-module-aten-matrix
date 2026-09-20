import { Regex } from '@companion-module/base'

export const ConfigFields = [
	{
		type: 'static-text',
		id: 'info',
		width: 12,
		label: 'Information',
		value: 'Control an ATEN HDMI Matrix via telnet. Ensure account details are correct and telnet is enabled on Web UI',
	},
	{
		type: 'textinput',
		id: 'host',
		label: 'Target IP',
		default: '',
		width: 6,
		regex: Regex.IP,
	},
	{
		type: 'textinput',
		id: 'port',
		label: 'Target Port',
		default: '23',
		width: 6,
		regex: Regex.PORT,
	},
	{
		type: 'textinput',
		id: 'user',
		label: 'Username',
		width: 6,
		default: 'administrator',
	},
	{
		type: 'textinput',
		id: 'pass',
		label: 'Password',
		width: 6,
		default: 'password',
	},
	{
		type: 'dropdown',
		id: 'device',
		label: 'Matrix Size',
		width: 6,
		default: '8x8',
		choices: [
			{ id: '2x2', label: '2 IN / 2 OUT Matrix (like VM0202H, VM0202HB)' },
			{
				id: '4x4',
				label: '4 IN / 4 OUT Matrix (like VM0404H, VM0404HA, VM0404HB, VM3404H, VM5404H, VM5404HA, VM6404H, VM6404HB)',
			},
			{ id: '8x8', label: '8 IN / 8 OUT Matrix (like VM0808H, VM0808HA, VM0808HB, VM5808H, VM5808HA)' },
			{ id: '8x9', label: '8 IN / 9 OUT Matrix (like VM6809H)' },
			{ id: '9x9', label: '9 IN / 9 OUT Matrix (like VM3909H)' },
			{ id: '16x16', label: '16 IN / 16 OUT Matrix (like VM51616H, VM1600, VM1600A)' },
			{ id: '32x32', label: '32 IN / 32 OUT Matrix (like VM3200, VM3250)' },
		],
	},
]
