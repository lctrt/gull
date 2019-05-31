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
    const [chan = 0, start = 0, duration = 'z'] = args
    const length = samplers[chan].length();

    length && channels[chan] && channels[chan].map(ch => {
        ch.player.buffer && ch.player.start('+0', to35ths(start, length), to35ths(duration, length, 1));
    });
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


const parseEditorContent = (text) => {
    channels = {}
    text.split('\n').map(function(line) {
        const rgx = /[\[]([0-9a-zA-Z])[\]][\[]([0-9a-zA-Z])[\]]/;
        const result = rgx.exec(line)
        if (result) {
            const chanId = result[1];
            const sampleId = result[2];
            const sampleUrl = sampleMap[sampleId]
            const player = new Tone.Player(sampleUrl).toMaster();
            if (!channels[chanId]) {
                channels[chanId] = [];
            }
            channels[chanId] = [
                ...channels[chanId],
                {
                    player,
                    length: () => player.buffer._buffer.duration
                }
            ];
        }
    })
}

const editorCheck = () => {
    if (editor.value != editorContent) {
        editorContent = editor.value;
        parseEditorContent(editorContent);
    }
}

setInterval(editorCheck, 200);
