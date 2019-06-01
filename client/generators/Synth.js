const Synth = (block) => {
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
}