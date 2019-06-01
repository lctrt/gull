const Machine = (blocks) => {
    // first block needs to be a sampler, other blocks treated as effects
    const [firstBlock, ...rest] = blocks;
    if (!firstBlock || firstBlock[0] !== 'S') return null;
    const channelId = firstBlock[1]
    const sampleId = firstBlock[2]
    const sampleUrl = sampleMap[sampleId]
    const player = new Tone.Player(sampleUrl);
    const length = () => player.buffer._buffer.duration;
    let play = (s = 0, d = 'z') => 
        player.toMaster().start("+0",to35ths(s, length()), to35ths(d, length()));

    blocks.forEach(block => {
        switch(block[0]) {
            case 'C': {
                const start = block[1];
                const duration = block[2];
                play = (s = start,d = duration) =>
                    player.toMaster().start("+0",to35ths(s, length()), to35ths(d, length()));
                break;
            }
        }
    });

    return {
        play,
        channelId
    };
};