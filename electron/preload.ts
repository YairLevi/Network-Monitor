import {contextBridge, ipcRenderer, IpcRendererEvent} from 'electron';
import axios from 'axios'
import {pyProcess} from './process'

declare global {
  interface Window {
    Main: typeof api;
    ipcRenderer: typeof ipcRenderer;
  }
}

const api = {
  testConnection: async (address: string): Promise<boolean> => {
    try {
      const res = await axios.get(`http://${address}:8000/test`)
      return res.status == 200
    } catch (e) {
      return false
    }

  },
  startPinging: async (isDev: boolean, name: string, address: string) => {
    pyProcess.spawn(isDev, address, name)
  },
  disconnect: async (name: string, address: string) => {
    await axios.get(`http://${address}:8000/disconnect?name=${name}`)
    pyProcess.shutdown()
  },
  shutdownPython: () => {
    pyProcess.shutdown()
  },
  on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => {
    ipcRenderer.on(channel, listener)
  },
  send: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, args)
  }
};
contextBridge.exposeInMainWorld('Main', api);
