import process from 'process';
import path from 'path';
import url from 'url';
import { app, BrowserWindow, Menu } from 'electron';

const isDev = process.env.NODE_ENV === 'development';
let win = null;

/* 初始化 */
function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  if (isDev) {
    win.webContents.openDevTools();
  }

  win.loadURL(isDev ? 'http://127.0.0.1:5050' : url.format({
    pathname: path.join(__dirname, '../dist/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // 去掉顶层菜单
  Menu.setApplicationMenu(null);

  win.on('closed', function() {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (win === null) {
    createWindow();
  }
});