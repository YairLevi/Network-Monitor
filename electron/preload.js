"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const axios_1 = __importDefault(require("axios"));
const process_1 = require("./process");
const api = {
    testConnection: async (address) => {
        try {
            const res = await axios_1.default.get(`http://${address}:8000/test`);
            return res.status == 200;
        }
        catch (e) {
            return false;
        }
    },
    startPinging: async (isDev, name, address) => {
        process_1.pyProcess.spawn(isDev, address, name);
    },
    disconnect: async (name, address) => {
        await axios_1.default.get(`http://${address}:8000/disconnect?name=${name}`);
        process_1.pyProcess.shutdown();
    },
    shutdownPython: () => {
        process_1.pyProcess.shutdown();
    },
    on: (channel, listener) => {
        electron_1.ipcRenderer.on(channel, listener);
    },
    send: (channel, ...args) => {
        electron_1.ipcRenderer.send(channel, args);
    }
};
electron_1.contextBridge.exposeInMainWorld('Main', api);
