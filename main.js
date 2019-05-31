const uiContext = document.getElementById('ui');
const socket = io('http://localhost:3000');

let samplers = [];
let sampleMap = {};

const editor = document.getElementById('editor');
let editorContent = '';
let channels = {};

const to35ths = (letter, total) => 
    (parseInt(letter,36)) * total / 35;

const play = (args = []) => {
    const [chan = 0, start, duration] = args
    channels[chan] && channels[chan].forEach(ch => ch(start,duration));
}

const loadUI = () => {
    uiContext.innerHTML = '';
    samplers.forEach(function(sampler, i) {
        uiContext.insertAdjacentHTML('beforeend', `<div class="sample">[${i}] ${sampler.name}</div>`);
    });
};

const loadSamples = ({files=[]}) => {
    const samples = files.filter((name) => name.includes('.wav'))
    samplers = samples.map(function (filename,i) {
        sampleMap[i] = `./samples/${filename}`;
        const player = new Tone.Player(`./samples/${filename}`).toMaster();

        return {
            player,
            name: filename.split('.wav')[0].substring(0,8),
            length: () => player.buffer && player.buffer._buffer ? player.buffer._buffer.duration : null
        };
    });
    loadUI();
};

socket.on('message', ({type, ...rest}) => {
    switch(type) {
        case 'filechange':
            loadSamples(rest);
            break;
        case 'trig':
            play(rest.msg.split(''));
    }
});



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

const splitBy = (list, groupSize) => 
    list.map((item, index) => 
        index % groupSize === 0 ? list.slice(index, index + groupSize) : null
    )
    .filter(item => item);


const parseEditorContent = (text) => {
    let newChannels = {}

    text.split('\n').forEach(function(line) {
        if (line == '') return null;
        const blocks = splitBy(
            line.split('').filter(c => c !== ' '),
            3
        ).filter(group => group.length === 3);

        const machine = Machine(blocks);
        if (machine != null) {
            const {channelId, play} = machine;
            if (!newChannels[channelId]) {
                newChannels[channelId] = [];
            }
            newChannels[channelId] = [
                ...newChannels[channelId],
                play
            ];
        }
    })

    setTimeout(function() {
        channels = newChannels
    }, 200);
}

const editorCheck = () => {
    if (editor.value != editorContent) {
        editorContent = editor.value;
        parseEditorContent(editorContent);
    }
}

setInterval(editorCheck, 200);
