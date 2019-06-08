# GULL

Gull is a *UDP sound machine* designed to be controlled externally. It was created as a companion application to the livecoding environment [ORCA](https://hundredrabbits.itch.io/orca).

## Install & Run

TODO / add details / package into electron app

If you want to build Gull yourself, follow these steps:

```
git clone https://github.com/lctrt/gull.git
cd gull
npm install
npm start
```

## File management 

Samples should be in `wav` format.
If you build yourself you can put your samples into `/samples`. 

### Project mode

You can select a folder with `File > Select Sample Folder`. This will load the samples in that folder, as well as the `default.gull` file if present.

~~The server will hot reload when new samples are added.~~ This got broken with the dynamic folder selection, will fix.

## editor commands:
* `meta` + arrow: fast cursor move (6 chars)

## Creating channels

A channel is written on one line of the editor. Channels can share the same id to be triggered together.

Channels are composed by blocks, each block start with a capital letter, with associated base36 parameters under it.

A channel start with a `C` block. 

It's then followed by a generator:

* P(sample, start, duration): sample player block
* S(waveform): synth block (waveform not supported yet)

After that you can follow up with effect blocks:

* R(room, wet): reverb
* D(intensity, wet): distortion

```
CPR
10I
.45
.2.
```

## Remote Control

Gull has up to 36 channels. Commands can be sent through UDP via the port `49161`.

### Play

The play command allows you to trigger samples.

| Command  | Channel | Octave | Fine | Velocity |
| :-       | :-:     | :-:    | :-:  | :-:      |
| `0`      | 0       | 0      | 0    |          |
| `04c`    | 0       | 4      | C    | _64_     |
| `04cf`   | 0       | 4      | C    | 127      |

For the sample player, the fine setting is in 35ths of an octave.
For the synth, the fine is notes (C,D,E etc)

### Remote editing

You can edit the current code character by character remotely. 

`ED004` <- Will replace the character on line 0, row 0 with the character `4`.

### Settings

- TODO

---

Special thanks to [Tone.js](https://tonejs.github.io), the scope of work would be quite different without it!
