# TODO / Ideas

Not committed to any of these — just tracked here for later investigation.

## More of the web interface

The web interface turned out to be a plain HTML/AJAX application, and the module already
uses it for the port and profile names (see `src/http.js`): POST the credentials to
`/login/checkuser.asp`, read the session id out of the response body, then call the same
endpoints the web pages use. Worth picking up from there:

1. **Save a profile under a name.** The matrix has no rename: posting a name to
   `/profile_list2.asp` saves a profile into the slot, which was confirmed by aiming it at
   an empty slot and watching one appear. So the sensible action is "Save Preset" with a
   slot and a name - store the current routing over Telnet (`SV nn`), then set the name.
   Still to confirm: whether that POST writes the same routing `SV` does, or something of
   its own. `/profile_list.asp` with `R1_DeleteProfile` empties a slot again.

2. **Controlling the matrix over HTTP instead of Telnet.** There is no WebSocket: the web
   pages poll XML files (e.g. `lib/video_wall.xml`) and post to `.asp` endpoints. That is a
   workable transport, but polling XML is not obviously better than the Telnet session,
   which already pushes switch notifications.

3. **Other things the web interface knows.** `lib/video_wall.xml` also carries the mute
   state and the per-port capabilities, neither of which the module reads yet.

## Use "read" for polling

The matrix answers `read` with its whole state in one go, including every route
("o01 i01 video on audio on" per output), the EDID mode, the firmware version and the
network settings. Polling that once would replace the `RO 1`..`RO n` loop - one command
instead of one per input - and would also give us the video/audio mute state per output.

## Detect the logged-in user's permission level

The matrix has its own user accounts with three permission levels (Administrator, Advanced
User, Basic User - see the web UI's User Account page). A Basic User can only open profiles,
so actions like Save Preset, or the factory reset, will presumably be refused for them. The
module currently has no idea which level it is logged in as, and would just look like the
command silently did nothing.

Unknown: whether the Telnet interface exposes the level at all. It is not in the documented
command list (`H`/`GT`/`IM`/`IP`/`LO`/`PW`/`RI`/`RO`/`SB`/`SS`/`SV`/`TI`/`VR`), so the
likely routes are:

- the login banner differing per level - worth comparing a Basic User login against an
  Administrator one
- the matrix answering a privileged command with an error, which we could detect and surface

Easiest way to find out: create a Basic User on the device, log the module in as that user,
and watch the debug log - unrecognized lines are logged, so whatever the matrix says about
permissions will show up there. Once detectable, `InstanceStatus.InsufficientPermissions`
exists for exactly this, and the affected actions could warn instead of failing silently.
