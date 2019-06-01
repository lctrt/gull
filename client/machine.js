const Machine = (blocks) => {
    // first block needs to be a sampler, other blocks treated as effects
    const [firstBlock, ...rest] = blocks;
    if (!firstBlock || firstBlock[0] !== 'S') return null;
    const channelId = firstBlock[1]
    const sampleId = firstBlock[2]
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

    blocks.forEach(block => {
        switch(block[0]) {
            case 'C': {
                const start = block[1];
                const duration = block[2];
                play = (octave = 1, fine = 0) => {
                    adjustPlaybackRate(octave, fine);
                    player.toMaster().start("+0",to35ths(start, length()), to35ths(duration, length()));
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