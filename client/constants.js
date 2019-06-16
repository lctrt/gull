const MACHINE_TYPE = {
    Player: 'P',
    Synth: 'S',
    External: 'E',
    P: 'Player',
    S: 'Synth',
    E: 'External',
}

const blockDescriptions = {
    'C': 'C(id): Channel',
    'E': 'E(volume): External input',
    'P': 'P(sample id, start, duration): sample player block',
    'S': 'S(waveform): synth block (waveform not supported yet)',
    'R': 'R(room, wet): reverb',
    'D': 'D(intensity, wet): distortion'
};

const keyCodeMap = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    delete: 8,
};

const parsingMap = {
    'E': 1,
    'C': 1,
    'S': 1,
    'P': 3,
    'R': 2,
    'D': 2
};