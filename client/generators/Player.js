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

