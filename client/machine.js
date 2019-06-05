const SoundGenerator = (block) => {
    if (!block) return false;
    switch(block[0]) {
        case 'P': 
            return Player(block);

        case 'S': 
            return Synth(block);
        default:
            return false;
    }
}
const MACHINE_TYPE = {
    Player: 'P',
    Synth: 'S',
    P: 'Player',
    S: 'Synth',
}

const Machine = function() {
    const machine = {
        soundGenerator: {},
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
        triggerPlayer: (octave = 1, fine = 0) => {
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
            const sampleId = firstBlock[2];
            const sampleUrl = sampleMap[sampleId];
            machine.player.load(sampleUrl);
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

const _Machine = (blocks) => {
    // first block needs to be a sound generator, other blocks treated as effects
    const [firstBlock, ...rest] = blocks;
    const soundGenerator = SoundGenerator(firstBlock);
    if (!soundGenerator) return null;
    let {
        type,
        channelId,
        player,
        length,
        dispose,
        adjustPlaybackRate,
        play
    } = soundGenerator;

    blocks.forEach(block => {
        switch(block[0]) {
            case 'C': {
                if (type === "PLAYER") {
                    const start = block[1];
                    const duration = block[2];
                    play = (octave = 1, fine = 0) => {
                        adjustPlaybackRate(octave, fine);
                        player.toMaster().start("+0",to35ths(start, length()), to35ths(duration, length()));
                    }
                }
                break;
            }
        }
    });

    return {
        dispose,
        play,
        channelId
    };
};