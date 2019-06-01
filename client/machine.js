const Player = (block) => {
    const channelId = block[1]
    const sampleId = block[2]
    const sampleUrl = sampleMap[sampleId]
    const player = new Tone.Player(sampleUrl);
    const length = () => player.buffer._buffer.duration;
    const adjustPlaybackRate = (octave, fine) => {
        player.playbackRate = fromBase36(octave) + to35ths(fine, 1);
    };

    let play = (octave = 1, fine = 0) => {
        adjustPlaybackRate(octave, fine);
        player.toMaster().start();
    }
    return {
        type: 'PLAYER',
        channelId,
        player,
        length,
        adjustPlaybackRate,
        play
    };
}

const SoundGenerator = (block) => {
    if (!block) return false;
    console.log(block)
    switch(block[0]) {
        case 'P': 
            return Player(block);

        case 'S': {
            const synth = new Tone.Synth();
            const channelId = block[1];
            const play = (octave = 0, note) => {
                synth.toMaster().triggerAttackRelease(`${note}${octave}`, "8n");
            }
            return {
                type: 'SYNTH',
                channelId,
                synth,
                play,
            };
            break;
        }
        default:
            return false;
    }
}

const Machine = (blocks) => {
    // first block needs to be a sound generator, other blocks treated as effects
    const [firstBlock, ...rest] = blocks;
    const soundGenerator = SoundGenerator(firstBlock);
    if (!soundGenerator) return null;
    let {
        type,
        channelId,
        player,
        length,
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
        play,
        channelId
    };
};