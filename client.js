const editor = document.getElementById('editor');
let editorContent = '';
let channels = {};

const play = (args = []) => {
    const [chan = 0, start, duration] = args
    channels[chan] && channels[chan].play(start,duration);
}

const loadSamples = ({files=[], path= ''}) => {
    const samples = files.filter((name) => name.includes('.wav'))
    samplers = samples.map(function (filename,i) {
        sampleMap[i] = `${path}/${filename}`
        return {
            name: filename.split('.wav')[0].substring(0,8),
        };
    });
};

const save = ({filename}) => filename && socket.sendSaveData(filename, JSON.stringify(gridData));

const openFile = ({filename, data})=> {
    gridData = JSON.parse(data);
    const splitPath = filename.split('/')
    Editor.filename = splitPath[splitPath.length - 1].replace('.gull', '');
    Editor.redraw();
}

const socket = Listener({
    onLoadSamples: (...args) => {loadSamples(...args);}, 
    onPlay: play,
    onSave: save,
    onOpenFile: openFile
});



const replaceChar = (line, rowId, char) => {
    const chars = line.split('');
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
const cleanupChannels = () => {
    Object.keys(channels).forEach(key => {
        channels[key].forEach(machine => {
            machine.dispose();
        });
    });
};

initChannels = () => {
    for(let i = 0; i<36 ; i++) {
        const channelId = i.toString(36).toUpperCase();
        channels[channelId] = Machine();
    }
};

initChannels();

const parseChannelId = (chan) => chan[0].params[0] || null;
const loadMachine = (chan) => {
    if (chan[0] && chan[0].type === 'C') {
        const channelId = parseChannelId(chan);
        channelId && channels[channelId].load(chan);
    }
};

const parseEditorContent = () => {
    gridData.forEach(function(line, y) {
        let chan = [];
        line.forEach((cell, x) => {
            if (cell.type === 'param') return ;
            if (Object.keys(parsingMap).includes(cell.char)) {
                Editor.cleanUnusedParams(x,y);
                cell.type = 'block';
                let start = y + 1;
                let end = y + parsingMap[cell.char];
                const params = [];
                for (let l = start; l <= end ; l++) {
                    const cell = gridData[l][x];
                    params.push(cell.char);
                    gridData[l][x] = { ...cell, type: 'param' };
                }
                chan.push({
                    type: cell.char,
                    params 
                })
            } else {
                loadMachine(chan);
                chan = [];
            }
            
        });
    });
};

Editor.onUpdate = parseEditorContent;
