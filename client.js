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

const parseChannelId = (blocks) => {
    if(blocks[0] ) {
        const channel = blocks[0][1];
        return channel || null;
    }
    return null;
}

const parsingMap = {
    'S': 2,
    'P': 4,
    'R': 2,
    'D': 2
};

const parseEditorContent = () => {
    gridData.forEach(function(line, y) {
        line.forEach(function(cell, x) {
            if (Object.keys(parsingMap).includes(cell.char)) {
                let start = y + 1;
                let end = y + parsingMap[cell.char];
                console.log(start, end)
                for (let l = start; l <= end ; l++) {
                    console.log(l,end, gridData[l][x])

                    gridData[l][x] = { type: 'param', char: '0' };
                }
            }
            
        });
        // const blocks = splitBy(
        //     line.filter(c => c != ''),
        //     3
        // ).filter(group => group.length === 3);
        // const channelId = parseChannelId(blocks);
        // if (channelId != null) {
        // channels[channelId].load(blocks);
        // }
    });
};

Editor.onUpdate = parseEditorContent
