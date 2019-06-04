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


const genGrid = (size=36) => {
    const arrayBase = new Array(36);
    const line = [...arrayBase].map(() => '');
    return [...arrayBase].map(() => [...line]);
}

let gridData = genGrid();
let cursorPos = [0,0];

const clearGrid = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height)
}

const drawIndicator = () => {
    ctx.fillStyle = '#DDD';
    const [x,y] = cursorPos;
    const sampleListDisplay = samplers.map(({name},i) => {
        return `[${i}] ${name.substring(0,5)}`
    }).join('');
    ctx.fillText(`[${x.toString(36)}${y.toString(36)}] ${gridData[y][x]}`, 10, gridHeight + cellSize * 2);
    ctx.fillText(`${Editor.filename}`, 10, gridHeight + cellSize * 4);
    ctx.fillText(`${sampleListDisplay}`, 10, gridHeight + cellSize * 6);
}

const drawGrid = () => {
    for (let x = 0; x<36; x++) {
        for (let y = 0; y<36; y++) {
            let char = gridData[y][x];
            if (x == cursorPos[0] && y == cursorPos[1]) {
                if (char == '') {
                    char = '@';
                }
                ctx.fillStyle = 'black';
            } else {
                ctx.fillStyle = char == ''  ? '#555' : '#DDD';
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

const keyMap = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    delete: 8,
};

const Editor = {
    filename: '',
    onUpdate : () => {},
    redraw: () => {
        clearGrid();
        drawCursor();
        drawGrid();
        drawIndicator();
    },
    remoteEditChar: (x,y,char) => {
        if (/[a-zA-Z0-9]/.test(char)) {
            gridData[y][x] = char;
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
        case keyMap.left:
            x = Math.max(0,x - distance);
            break;
        case keyMap.up:
            y = Math.max(0,y - distance);
            break;
        case keyMap.down:
            y = Math.min(35,y + distance)
            break;
        case keyMap.right:
            x = Math.min(35,x + distance)
            break;
        case keyMap.delete:
            gridData[y][x] = '';
            Editor.onUpdate();
            x = Math.max(0,x - 1);
            break;
        default:
            const char = String.fromCharCode(event.keyCode);
            if (/[a-zA-Z0-9]/.test(char)) {
                gridData[y][x] = char;
                x = Math.min(35,x + 1)
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
