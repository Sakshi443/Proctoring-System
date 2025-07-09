const { app, BrowserWindow } = require('electron');
const path = require('path');
const childProcess = require('child_process');

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    fullscreen: true,  // Force fullscreen for proctoring
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),  // Optional
    },
  });

  mainWindow.loadURL('http://localhost:5000');  // Your Express app

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (serverProcess) serverProcess.kill(); // Kill Express server when app closes
  });
}

app.whenReady().then(() => {
  // Start Express server in background
  serverProcess = childProcess.spawn('node', ['app.js'], {
    cwd: __dirname,
    shell: true,
    env: process.env,
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
