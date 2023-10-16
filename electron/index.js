"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importStar(require("path"));
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const height = 700;
const width = 1100;
const iconPath = path_1.default.join(__dirname, '..', 'resources', 'icon.png');
let requirePrepare = true;
function createWindow() {
    // Create the browser window.
    const window = new electron_1.BrowserWindow({
        width,
        height,
        icon: iconPath,
        webPreferences: {
            preload: (0, path_1.join)(__dirname, 'preload.js'),
            sandbox: false
        }
    });
    const port = process.env.PORT || 3000;
    const url = electron_is_dev_1.default ? `http://localhost:${port}` : (0, path_1.join)(__dirname, '../build/index.html');
    // and load the index.html of the app.
    if (electron_is_dev_1.default) {
        window?.loadURL(url);
    }
    else {
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
    electron_1.ipcMain.on('close', () => {
        requirePrepare = false;
        setTimeout(() => {
            window.close();
        }, 1000);
    });
    window.on('close', (e) => {
        if (requirePrepare) {
            e.preventDefault();
            window.webContents.send('cleanup-python-process');
        }
        else {
            electron_1.app.quit();
        }
    });
}
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        // On MacOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.on('window-all-closed', (ev) => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
