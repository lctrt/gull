# GULL

Gull is a *UDP sampler* designed to be controlled externally. It was created as a companion application to the livecoding environment [ORCA](https://hundredrabbits.itch.io/orca).

## Install & Run

TODO / add details / package into electron app

```
npm i
node server.js
http-server index.html
```

## Config
Samples should be in `wav` format and go into `/samples`. The server will hot reload when new samples are added.

## Commands

Gull has up to 36 sampler voices. Commands can be sent through UDP via the port `49161`.

### Play

The play command allows you to trigger samples

| Command  | Sampler | Start | Duration | Velocity |
| :-       | :-:     | :-:   | :-:      | :-:      |
| `0`      | 0       | 0     | 100%     |          |
| `04c`    | 0       | 4     | C        | _64_     |
| `04cf`   | 0       | 4     | C        | 127      |

The start position and duration are expressed in 35ths of the sample total duration, 0 being the lowest value and Z the maximum.

### Settings

- TODO