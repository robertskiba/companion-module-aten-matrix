# companion-module-aten-matrix

A [Bitfocus Companion](https://bitfocus.io/companion) module to control ATEN HDMI matrix switches over Telnet.

It has been tested with the ATEN VM0808HA. See [companion/HELP.md](companion/HELP.md) for the full list of actions,
feedbacks and variables shown inside Companion.

## Compatible devices

All of ATEN's "VanCryst" HDMI matrix switches (the Standard, Seamless and HDBaseT product lines) share the same
Telnet command set (`SS`/`RO`/`LO`/...) this module speaks, confirmed against ATEN's own manuals for the VM0808HA,
VM0404HB/VM0808HB, VM51616H and VM3404H. The rest of the lineup below is expected to work the same way, but hasn't
been individually verified.

**Current**

- VM0202H / VM0202HB – 2x2 (True) 4K HDMI Matrix Switch
- VM0404HA / VM0404HB – 4x4 (True) 4K HDMI Matrix Switch
- VM0808HB – 8x8 True 4K HDMI Matrix Switch
- VM3404H – 4x4 4K HDMI HDBaseT-Lite Matrix Switch
- VM5404H / VM5404HA – 4x4 HDMI Matrix Switch with Scaler
- VM5808H / VM5808HA – 8x8 HDMI Matrix Switch with Scaler
- VM6404HB – 4x4 True 4K HDMI Matrix Switch with Scaler
- VM6809H – 8x9 4K HDMI Matrix Switch with Scaler
- VM51616H – 16x16 HDMI Matrix Switch with Scaler

**Discontinued**

- VM0404H – 4x4 HDMI Matrix Switch
- VM0808H – 8x8 HDMI Matrix Switch
- VM0808HA – 8x8 4K HDMI Matrix Switch (the model this module was originally tested with)
- VM6404H – 4x4 4K HDMI Matrix Switch with Scaler
- VM3909H – 9x9 4K HDMI HDBaseT-Lite Matrix Switch

ATEN's modular chassis-based matrix switches (VM1600/VM1600A, VM3200/VM3250) use swappable I/O boards and a
different management architecture, so it's unconfirmed whether they speak the same command set.

## Configuration

| Field       | Description                                                                  |
| ----------- | ---------------------------------------------------------------------------- |
| Target IP   | IP address of the matrix                                                     |
| Target Port | Telnet port of the matrix (default `23`)                                     |
| Username    | Telnet login username (default `administrator`)                              |
| Password    | Telnet login password (default `password`)                                   |
| Matrix Size | Number of inputs/outputs, e.g. 8x8 (VM0808HA) or an asymmetric size like 8x4 |

Telnet access has to be enabled in the matrix's web UI before the module can connect.

## Actions, feedbacks & variables

**Actions**

- **XP:Switch** – route an input to an output directly
- **Select source for take** / **Select destination for take** / **Route selected ports** – two-step routing: pick an
  input and an output on separate buttons, then press a "take" button to route them
- **Recall Preset** / **Save Preset** – recall or store one of the matrix's connection profiles
- **Refresh routing status** – re-read the routing of every output from the matrix

**Feedbacks**

- **Route** – true if the given input is routed to the given output (`0` = currently selected source/destination)
- **Source selected** / **Destination selected** – true if the given input/output is selected for a take
- **Preset recalled** – true if the given preset was the last one recalled via Companion
- **Connected** – true while the module has an active, logged-in Telnet session with the matrix

**Variables**

- `source_O<n>` – input currently routed to output `n`, updated live on every switch and re-read every 15 seconds
- `last_preset` – last preset recalled via Companion
- `firmware_version` – software version reported by the matrix
- `selected_source` / `selected_destination` – input/output currently picked for a take

**Presets**

Ready-made buttons for the actions and feedbacks above: one "Select Input"/"Select Output" button per port for the
take workflow (output buttons also show their currently routed input), a "Take" button showing the pending
selection, one button per matrix preset/profile number, and a "Connected" status button.

Buttons created with the previous version of this module (the `Set Crosspoint`, `Load Profile` and `Crosspoint set`
definitions) are migrated to the new actions and feedbacks automatically.

## License

MIT, see [LICENSE](LICENSE).
