let cellSize = 15;
let offset = cellSize / 2;
let indicatorHeight = 100;
let gridHeight = cellSize * 36;
let sampleMap = {};
let samplers = [];

const canvas = document.getElementById('canvas-editor');
canvas.height = gridHeight + indicatorHeight;
canvas.width = cellSize * 36;
const ctx = canvas.getContext('2d')
ctx.font = `${cellSize}px monospace`;

class GridData {
    constructor(size = 36) {
        const arrayBase = new Array(size);
        const line = [...arrayBase].map(() => ({ char: '' }));
        this.data = [...arrayBase].map(() => [...line]);
    }
    set(x,y, content) {
        this.data[y][x] = content;
    } 
    get(x,y) {
        return this.data[y][x];
    }
}

const genGrid = (size = 36) => {
    const arrayBase = new Array(size);
    const line = [...arrayBase].map(() => ({ char: '' }));
    return [...arrayBase].map(() => [...line]);
}

let gridData = genGrid();
let cursorPos = [0,0];

const clearGrid = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height)
}

const getDescription = (cell) => {
    if (cell.type === 'param') { return ''; }
    if (Object.keys(blockDescriptions).includes(cell.char)) {
        return  blockDescriptions[cell.char];
    }        
    return '';
};
const drawIndicator = () => {
    ctx.fillStyle = '#DDD';
    const [x,y] = cursorPos;
    const sampleListDisplay = samplers.map(({name},i) => {
        return `[${i}] ${name.substring(0,5)}`
    }).join(' ');
    const cell = gridData[y][x];
    const blockDescription = getDescription(cell);
    ctx.fillText(`[${x.toString(36)}${y.toString(36)}] ${blockDescription}`, 10, gridHeight + cellSize * 2);
    ctx.fillText(`${Editor.filename}`, 10, gridHeight + cellSize * 4);
    ctx.fillText(`${sampleListDisplay}`, 10, gridHeight + cellSize * 6);
}

const drawGrid = () => {
    for (let x = 0; x<36; x++) {
        for (let y = 0; y<36; y++) {
            let { char, type } = gridData[y][x];
            if (x == cursorPos[0] && y == cursorPos[1]) {
                if (char == '') {
                    char = '@';
                }
                ctx.fillStyle = 'black';
            } else {
                if (type === 'block') {
                    ctx.fillStyle = 'lightgreen'
                } else {
                    ctx.fillStyle = type !== 'param'  ? '#555' : '#DDD';
                }
            }
            ctx.fillText(char == '' ? '.' : char, offset * 0.5 + x * cellSize,  offset * 1.5 + y * cellSize);
        }
    }
}

const drawCursor = () => {
    const [x,y] = cursorPos;
    ctx.fillStyle = 'orange';
    ctx.fillRect(x * cellSize,y * cellSize,cellSize,cellSize)
};

drawCursor()
drawGrid();
setTimeout(() => {
    drawIndicator();
}, 200);

const Editor = {
    filename: '',
    onUpdate : () => {},
    redraw: () => {
        clearGrid();
        drawCursor();
        drawGrid();
        drawIndicator();
    },
    cleanUnusedParams: (x,y) => {
        let l = y + 1;
        let cell = gridData[l][x];
        while(cell.type == 'param') {
            cell.type = undefined;
            l = l + 1;
            cell = gridData[l][x];
        }
    },
    remoteEditChar: (x,y,char) => {
        if (/[a-zA-Z0-9]/.test(char)) {
            gridData[y][x] = {
                ...gridData[y][x],
                char
            };
            Editor.onUpdate();
            clearGrid();
            drawCursor(cursorPos[0],cursorPos[1]);
            drawGrid();
            drawIndicator();
        }
    }
};

document.addEventListener('keydown', (e) => {
    let [x,y] = cursorPos;
    const distance = e.metaKey ? 6 : 1;
    switch(e.keyCode) {
        case keyCodeMap.left:
            x = Math.max(0,x - distance);
            break;
        case keyCodeMap.up:
            y = Math.max(0,y - distance);
            break;
        case keyCodeMap.down:
            y = Math.min(35,y + distance)
            break;
        case keyCodeMap.right:
            x = Math.min(35,x + distance)
            break;
        case keyCodeMap.delete:
            if (gridData[y][x].type === 'block') {
                Editor.cleanUnusedParams(x,y);
            }
            gridData[y][x] = { char: ''};
            Editor.onUpdate();
            break;
        default:
            const char = String.fromCharCode(event.keyCode);
            if (/[a-zA-Z0-9]/.test(char)) {
                gridData[y][x] = {char};
                Editor.onUpdate();
            } else {
            }
            break;
    }
    cursorPos = [x, y]
    clearGrid();
    drawCursor(x,y);
    drawGrid();
    drawIndicator();
})
