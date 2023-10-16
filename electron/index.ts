import {app, BrowserWindow, ipcMain} from 'electron';
import path, {join} from 'path';
import isDev from 'electron-is-dev';

const height = 700;
const width = 1100;

const iconPath = path.join(__dirname, '..', 'resources', 'icon.png')
let requirePrepare = true

function createWindow() {
  // Create the browser window.
  const window = new BrowserWindow({
    width,
    height,
    icon: iconPath,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      sandbox: false
    }
  });


  const port = process.env.PORT || 3000;
  const url = isDev ? `http://localhost:${port}` : join(__dirname, '../build/index.html');
  // and load the index.html of the app.
  if (isDev) {
    window?.loadURL(url);
  } else {
    window?.loadFile(url);
  }


  // This is a manual closing of the window, explained.
  // So, since I need to close all the python processes before exit,
  // I can't just close regularly. the order is:
  //
  // User Closes window
  // -> Send request to close python process from renderer
  // -> Renderer asks again to close window
  // -> Main process sets timeout, to give time roughly until processes are closed.

  ipcMain.on('close', () => {
    requirePrepare = false
    setTimeout(() => {
      window.close()
    }, 1000)
  })

  window.on('close', (e) => {
    if (requirePrepare) {
      e.preventDefault()
      window.webContents.send('cleanup-python-process')
    } else {
      app.quit()
    }
  })
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    // On MacOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

app.on('window-all-closed', (ev) => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
