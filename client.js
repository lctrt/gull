const uiContext = document.getElementById('ui');

let samplers = [];
let sampleMap = {};

const editor = document.getElementById('editor');
let editorContent = '';
let channels = {};

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

const listener = Listener(loadSamples, play);

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
