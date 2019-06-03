const { app, dialog, BrowserWindow, Menu, MenuItem } = require('electron');

require('./server');

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 560,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html');
}

app.on('ready', createWindow)

// mainWindow is your instance of BrowserWindow
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
      { label: 'Select Sample Folder', click: selectDirectory}
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