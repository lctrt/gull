const { app, dialog, BrowserWindow, Menu } = require('electron');

require('./server');

function createWindow () {
  let win = new BrowserWindow({
    width: 560,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html');
}

app.on('ready', createWindow)

function selectDirectory() {
  dialog.showOpenDialog(app.win, {
    properties: ['openDirectory']
  }, ([path] = []) => {
    if (path) {
      global.samplePath = path;
      global.socket.loadSamples();

      console.log(global.samplePath);
    }
  });
}

function save() {
  dialog.showSaveDialog(app.win, {
    filters: [{name: 'gull', extensions: ['gull']}]
  }, (filename) => {
    global.socket.requestSave(filename);
  });
}

function open() {
  dialog.showOpenDialog(app.win, {
    filters: [{name: 'gull', extensions: ['gull']}]
  }, ([path] = []) => {
    if (path) {
      global.socket.openFile(path);
    };
  })
}

const menuTemplate = [
  ...(process.platform === 'darwin' ? [{
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ],
  }] : []),
  {
    label: 'File',
    submenu: [
      { label: 'Select Sample Folder', click: selectDirectory },
      { label: 'Open', click: open },
      { label: 'Save', click: save }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);