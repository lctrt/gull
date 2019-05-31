# GULL

Gull is a *UDP sampler* designed to be controlled externally. It was created as a companion application to the livecoding environment [ORCA](https://hundredrabbits.itch.io/orca).

## Roadmap
I've been quite inspired by Orca and what is being done with it.
To really enjoy it I need a configurable sampler, so there's a proof of concept of that in the form of a barebones live editable config.

But what could come next: grid like config, between orca and [zoia](https://empresseffects.com/products/zoia) to create custom channels that can be triggered by UPD.
Then more custom blocks for effects, lfo, sound generators.

Special thanks to [Tone.js](https://tonejs.github.io), the scope of work would be quite different without it!

## Install & Run

TODO / add details / package into electron app

```
npm i
node server.js
http-server index.html
```

## Config
Samples should be in `wav` format and go into `/samples`. The server will hot reload when new samples are added.

## Creating sampler channels

A channel is written on one line of the editor. Channels can share the same id to be triggered together.

Channels are composed by blocks, each block start with a capital letter then is followed by base 36 parameters.

2 blocks are available at the moment:

* S(chan, sampler): sampler block, must be present at the start of a chain
* C(start, duration): sample cutter, set cutting default (can be overwritten by message on a trigger basis)

Possible upcoming blocks: 

* D(time,feedback) : delay
* R(decay, wet): reverb

## Remote Control

Gull has up to 36 sampler voices. Commands can be sent through UDP via the port `49161`.

### Play

The play command allows you to trigger samples

| Command  | Channel | Start | Duration | Velocity |
| :-       | :-:     | :-:   | :-:      | :-:      |
| `0`      | 0       | 0     | 100%     |          |
| `04c`    | 0       | 4     | C        | _64_     |
| `04cf`   | 0       | 4     | C        | 127      |

The start position and duration are expressed in 35ths of the sample total duration, 0 being the lowest value and Z the maximum.

### Settings

- TODO