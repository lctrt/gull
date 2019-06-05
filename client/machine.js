const MACHINE_TYPE = {
    Player: 'P',
    Synth: 'S',
    P: 'Player',
    S: 'Synth',
}

const Machine = function() {
    const machine = {
        soundGenerator: {},
        synth: new Tone.Synth(),
        player: new Tone.Player(),
        adjustPlaybackRate: (octave, fine) => {
            machine.player.playbackRate = fromBase36(octave) + to35ths(fine, 1);
        },
        play: (...args) => {
            if (machine.type === 'Player') {
                machine.triggerPlayer(...args);
            }
            if (machine.type === 'Synth') {
                machine.triggerSynth(...args);
            }
        },
        triggerSynth: (octave = 0, note) => {
            machine.synth.toMaster().triggerAttackRelease(`${note}${octave}`, "8n");
        },
        triggerPlayer: (octave = 1, fine = 0) => {
            if (! machine.player.buffer || !machine.player.buffer._buffer) return ;
            machine.adjustPlaybackRate(octave, fine);
            machine.player.toMaster().start("+0",to35ths(machine.start, machine.length()), to35ths(machine.duration, machine.length()));
        },
        length:() => machine.player.buffer._buffer.duration,
        start: 0,
        duration: 'z',
        load: (blocks) => {
            // first block needs to be a sound generator, other blocks treated as effects
            const [firstBlock, ...rest] = blocks;
            machine.type = MACHINE_TYPE[firstBlock[0]] ? MACHINE_TYPE[firstBlock[0]] : null;
            if (machine.type === 'Player') {
                const sampleId = firstBlock[2];
                const sampleUrl = sampleMap[sampleId];
                machine.player.load(sampleUrl);
            }
            rest.forEach(block => {
                switch(block[0]) {
                    case 'C':
                        machine.start = block[1];
                        machine.duration = block[2];
                }
            })
        }
    }
    return machine;
}
