const MACHINE_TYPE = {
    Player: 'P',
    Synth: 'S',
    P: 'Player',
    S: 'Synth',
}

const blockDescriptions = {
    'C': 'C(id): Channel',
    'P': 'P(sample id, start, duration): sample player block',
    'S': 'S(waveform): synth block (waveform not supported yet)',
};

const keyCodeMap = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    delete: 8,
};

const parsingMap = {
    'C': 1,
    'S': 2,
    'P': 3,
    'R': 2,
    'D': 2
};