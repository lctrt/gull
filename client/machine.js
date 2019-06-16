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
        external: new Tone.UserMedia(0.5),
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
        blockKeys: '',
        handleGeneratorConfig(firstBlock = {}) {
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
            } else if(machine.type === 'External') {
                const volume = firstBlock.params[0] !== '' ? to35ths(firstBlock.params[0], 50) - 50 : 0;
                machine.external.volume.value = volume;
            }
        },
        createChain([firstBlock, ...blocks]) {
            // first block needs to be a sound generator, other blocks treated as effects
            if (!firstBlock) return ;
            machine.handleGeneratorConfig(firstBlock);
            const chainNodes = blocks.map(({type, params}) => 
                Object.keys(effectKeyMap).includes(type) 
                && effectKeyMap[type](...params)).filter(n => n);

            machine.chainNodes = chainNodes;
            chain = new Tone.Gain().chain(...chainNodes.map(block => block.node), Tone.Master)
            if (MACHINE_TYPE[firstBlock.type] === "External") {
                machine.external.disconnect();
                machine.external.connect(chain);
                machine.external.open();
            } else {
                machine.synth.disconnect();
                machine.synth.connect(chain);
                machine.player.disconnect();
                machine.player.connect(chain);
            }
            // might need to dispose of all previous nodes in chain separately?
            machine.chain.dispose();
            machine.chain = chain;

        },
        updateParams([firstBlock, ...blocks]) {
            machine.handleGeneratorConfig(firstBlock);
            blocks.forEach(({params}, index) => {
                params.forEach((param, paramIndex) => {
                    const paramKey = machine.chainNodes[index].params()[paramIndex]
                    machine.chainNodes[index][paramKey](param || 0);
                });
            });
        },
        blockTypes(blocks = []) {
            return blocks.map(b => b.type).join('');
        },
        load: ([chan, ...blocks]) => {
            blocks = chan.type === 'E' ? [chan,...blocks] : blocks;
            if (machine.blockTypes(blocks) == machine.blockKeys) {
                // only change params, no re-creation of audio nodes
                machine.updateParams(blocks);
            } else {
                machine.blockKeys = machine.blockTypes(blocks);
                machine.createChain(blocks);
            }
        }
    }
    return machine;
}
