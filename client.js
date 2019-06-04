const editor = document.getElementById('editor');
let editorContent = '';
let channels = {};

const play = (args = []) => {
    const [chan = 0, start, duration] = args
    channels[chan] && channels[chan].forEach(ch => ch(start,duration));
}

const loadSamples = ({files=[], path= ''}) => {
    const samples = files.filter((name) => name.includes('.wav'))
    samplers = samples.map(function (filename,i) {
        sampleMap[i] = `${path}/${filename}`;
        const player = new Tone.Player(`${path}/${filename}`).toMaster();

        return {
            player,
            name: filename.split('.wav')[0].substring(0,8),
            length: () => player.buffer && player.buffer._buffer ? player.buffer._buffer.duration : null
        };
    });
};

const save = ({filename}) => filename && socket.sendSaveData(filename, JSON.stringify(gridData));

const openFile = ({filename, data})=> {
    gridData = JSON.parse(data);
    console.log(JSON.parse(data))
    const splitPath = filename.split('/')
    Editor.filename = splitPath[splitPath.length - 1].replace('.gull', '');
    Editor.redraw();
}

const socket = Listener({
    onLoadSamples: loadSamples, 
    onPlay: play,
    onSave: save,
    onOpenFile: openFile
});



const replaceChar = (line, rowId, char) => {
    const chars = line.split('');
    console.log(chars, rowId);
    if (chars.length > rowId) {
        chars[rowId] = char;
    }
    return chars.join('');
};

const remoteEdit = (rowId, lineId, char) => {
    Editor.remoteEditChar(rowId, lineId, char)
    const lines = editor.value.split('\n')
    if (lines.length > lineId)  {
        lines[lineId] = replaceChar(lines[lineId],rowId, char);
        editor.value = lines.join('\n');
    } 
};

const parseEditorContent = () => {
    let newChannels = {};
    gridData.forEach(function(line) {
        const blocks = splitBy(
            line.filter(c => c != ''),
            3
        ).filter(group => group.length === 3);
        const machine = Machine(blocks);
        if (machine != null) {
            console.log(machine)
            const {channelId, play} = machine;
            if (!newChannels[channelId]) {
                newChannels[channelId] = [];
            }
            newChannels[channelId] = [
                ...newChannels[channelId],
                play
            ];
        }
    });

    setTimeout(function() {
        channels = newChannels
    }, 200);
};

Editor.onUpdate = parseEditorContent
