# Changelog

## 3.0.0

### Breaking

- Rewritten for `@companion-module/base` v2, so the module needs a Companion version that supports it.
- `Set Crosspoint` is now **Route Input directly to Output**, and `Load Profile` is **Recall Preset**. The
  `Crosspoint set` feedback is now **Route**. Buttons using the old definitions are migrated automatically,
  including their option values.
- The `Device Type` dropdown is gone. The matrix names its own model when logging in, and the module takes the
  number of inputs and outputs from that; a size dropdown only appears if it reports a model this module does
  not know. Existing configurations are migrated.
- Passwords: enter the one you want the matrix to use in `Password` and tick "Automatically change to selected
  password if factory default password is active". A factory-fresh matrix demands a password change before it
  can be used at all, and the module now handles that instead of failing to log in.

### Added

- **Variables.** The module had none. There are now `output_<n>_source` for the input feeding each output,
  updated live and re-read every 15 seconds, plus `model`, `firmware_version`, `last_preset`,
  `selected_source`/`selected_destination` and the names below.
- **Ready-made buttons.** The module had none. Select Input, Select Output, Take and Recall Preset are one
  definition each, turned into a button per port or per saved profile, showing names and live routing.
- **Port and profile names**, read from the matrix's web interface over HTTP and shown behind the number in
  every dropdown ("Input 5 - Input5Server"): `input_<n>_name`, `output_<n>_name`, `preset_<n>_name`,
  `selected_source_name`, `selected_destination_name`.
- **A take workflow**: pick a source and a destination on separate buttons, then route them with **Take**.
- **Save Preset**, **Refresh routing status**, **Refresh port and preset names**, **Rename port**, and
  **Factory reset device** behind a confirmation checkbox in the action's options.
- Feedbacks for the selected source and destination, for the last preset recalled, and for the connection
  state.
- Ports and presets are picked from dropdowns rather than typed as numbers. Where it makes sense the dropdown
  also offers "Selected source"/"Selected destination", which is the default; in expression mode a port number
  or the word `selected` is accepted.
- Only profile slots the matrix actually has something saved in get a name variable and a button. An empty slot
  is left out rather than shown under the matrix's placeholder name "Untitled".

### Fixed

- Reconnects back off exponentially instead of retrying every two seconds, which used to trip the matrix's own
  lockout ("Login locked. Please wait for 5 minutes").
- A rejected username or password stops the retries rather than hammering the matrix until it locks the account
  out.

## 2.0.2 and earlier

See the commit history.
