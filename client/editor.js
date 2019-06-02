let cellSize = 20;
let offset = cellSize / 2;

const canvas = document.getElementById('canvas-editor');
canvas.height = cellSize * 36;
canvas.width = cellSize * 36;
const ctx = canvas.getContext('2d')

const genGrid = (size=36) => {
    const arrayBase = new Array(36);
    const line = [...arrayBase].map(() => '');
    return [...arrayBase].map(() => [...line]);
}

const gridData = genGrid();
let cursorPos = [0,0];

const clearCanvas = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,cellSize * 36, cellSize * 36)
}
const drawGrid = () => {
    ctx.font = `${cellSize}px monospace`;

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

const keyMap = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    delete: 8,
};

const Editor = {
    onUpdate : () => {},
    remoteEditChar: (x,y,char) => {
        if (/[a-zA-Z0-9]/.test(char)) {
            gridData[y][x] = char;
            Editor.onUpdate();
            clearCanvas();
            drawCursor(cursorPos[0],cursorPos[1]);
            drawGrid();

        }
    }
};

document.addEventListener('keyup', (e) => {
    let [x,y] = cursorPos;
    switch(e.keyCode) {
        case keyMap.left:
            x = Math.max(0,x - 1);
            break;
        case keyMap.up:
            y = Math.max(0,y - 1);
            break;
        case keyMap.down:
            y = Math.min(35,y + 1)
            break;
        case keyMap.right:
            x = Math.min(35,x + 1)
            break;
        case keyMap.delete:
            gridData[y][x] = '';
            Editor.onUpdate();
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
    clearCanvas();
    drawCursor(x,y);
    drawGrid();
})
