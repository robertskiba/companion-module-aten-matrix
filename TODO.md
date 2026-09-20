# TODO / Ideas

Not committed to any of these — just tracked here for later investigation.

## Auto-enable Telnet / control via HTTP instead of Telnet

Right now the user has to manually enable Telnet in the matrix's web UI before this module
can connect at all (it's disabled by default on at least some firmware versions). Two related
ideas worth investigating, both requiring access to real hardware (or at least a browser's
dev tools / a packet capture against one) since ATEN doesn't publish an HTTP API for these
devices and no prior art (reverse-engineered client, Home Assistant integration, forum
write-up) turned up in a search:

1. **Auto-enable Telnet via the web UI.** The manual's "Network" settings page has a
   Telnet Enable/Disable toggle alongside DHCP/IP/Subnet/Gateway/Website-Timeout, saved via
   a "Save" button — so it's a plain HTML form on the built-in web server. If we can figure
   out the login flow (session cookie? HTTP Basic Auth?) and the form's POST target, the
   module could optionally log into the web UI first and flip that switch on connect,
   instead of asking the user to do it by hand.

2. **Controlling the matrix over HTTP/WebSocket instead of Telnet.** If the web GUI's
   live views (e.g. the crosspoint grid, output status) are backed by polling AJAX calls or
   a WebSocket rather than being fully server-rendered, that could be a more robust
   transport than raw Telnet line-scraping — but this is speculative until someone inspects
   actual network traffic from the web UI.

Needs: real device access (or someone willing to capture their browser's network tab while
using the web UI) to confirm login mechanism, the Telnet-toggle endpoint, and whether
anything WebSocket-based exists at all before any of this can be implemented.

## Companion button presets

Auto-generate ready-made button presets (`setPresetDefinitions`) so the take-workflow
actions/feedbacks are usable out of the box instead of requiring manual button setup:

- one "Select Input N" button per input (wired to `selectSource` + `sourceSelected` feedback)
- one "Select Output N" button per output (wired to `selectDestination` + `destinationSelected`)
- a "Take" button (`takeSalvo`)
- optionally one preset per output showing the routed input via the `route`/`source_O<n>`
  variable, and one per matrix preset/profile number (`preset` action)

Straightforward to build (no protocol/hardware unknowns involved, unlike the item above) —
just needs someone to sit down and design the button layout/styling.
