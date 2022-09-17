const { contextBridge, ipcRenderer } = require('electron');

const validChannels = ['resize', 'close', 'windowMoving'];
contextBridge.exposeInMainWorld('ipc', {
  send: (channel, data) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
});
