# ATEN HDMI Matrix

This module connects to ATEN HDMI Matricies via Telnet. It has been tested with:

- ATEN VM0808HA

But it should also work with:

- ATEN VM0404HA
- ATEN VM0404HB
- ATEN VM0808HA
- ATEN VM0808HB
- ATEN VM51616H

And maybe others using same control protocol.

## Available Actions

- **XP:Switch** – route an input to an output directly
- **Select source for take** / **Select destination for take** / **Route selected ports** – two-step routing: pick an input and an output on separate buttons, then press a "take" button to route them
- **Recall Preset** / **Save Preset** – recall or store one of the matrix's connection profiles
- **Refresh routing status** – re-read the routing of every output from the matrix

## Available Feedbacks

- **Route** – true if the given input is routed to the given output (use `0` for input and/or output to refer to the currently selected source/destination)
- **Source selected** / **Destination selected** – true if the given input/output is currently selected for a take
- **Preset recalled** – true if the given preset was the last one recalled via Companion (presets recalled from the front panel, web UI or another controller are not reflected)
- **Connected** – true while the module has an active, logged-in Telnet session with the matrix

## Available Variables

- `source_O<n>` – number of the input currently routed to output `n`, updated live whenever the matrix reports a switch and re-read every 15 seconds
- `last_preset` – number of the last preset recalled via Companion
- `firmware_version` – software version reported by the matrix
