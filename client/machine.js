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