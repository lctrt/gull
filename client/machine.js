const effectKeyMap = {
    'R': genEffectNode(Freeverb),
    'D': genEffectNode(Distortion)
};

const Machine = function() {
    const machine = {
        soundGenerator: {},
        sample: '',
        chain: new Tone.Gain().chain(Tone.Master),
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
        triggerSynth: (octave = 3, note = 'C') => {
            machine.synth
            .toMaster()
            .triggerAttackRelease(`${note}${octave}`, "8n");
        },
        triggerPlayer: (octave = 1, fine = 0) => {
            if (! machine.player.loaded) return ;
            machine.adjustPlaybackRate(octave, fine);
            machine.player.stop();
            machine.player
            .toMaster()
            .start(
                "+0",
                to35ths(machine.cutter.start, machine.length()), 
                to35ths(machine.cutter.duration, machine.length())
                );
        },
        length:() => machine.player.buffer._buffer.duration,
        cutter: {
            start: 0,
            duration: 'z'
        },
        getBlockKeys(blocks) {
            return blocks.map(b => b[0]);
        },
        blockKeys: [],
        load: ([chan, ...blocks]) => {
            // first block needs to be a sound generator, other blocks treated as effects
            const [firstBlock, ...rest] = blocks;
            if (!firstBlock) return ;
            machine.type = MACHINE_TYPE[firstBlock.type] ? MACHINE_TYPE[firstBlock.type] : null;
            if (machine.type === 'Player') {
                const sampleId = firstBlock.params[0];
                const sampleUrl = sampleMap[sampleId];
                if (sampleUrl && machine.sample != sampleUrl) {
                    machine.player.load(sampleUrl);
                    machine.sample = sampleUrl;
                }
                machine.cutter.start = firstBlock.params[1] || "0";
                machine.cutter.duration = firstBlock.params[2] || "Z";

            }
            const chainNodes = rest.map(({type, params}) => 
                Object.keys(effectKeyMap).includes(type) 
                && effectKeyMap[type](...params).node).filter(n => n);

            chain = new Tone.Gain().chain(...chainNodes, Tone.Master)
            machine.synth.disconnect();
            machine.synth.connect(chain);
            machine.player.disconnect();
            machine.player.connect(chain);

            // might need to dispose of all previous nodes in chain separately?
            machine.chain.dispose();
            machine.chain = chain;
        }
    }
    return machine;
}
