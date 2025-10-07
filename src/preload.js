
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dbAPI', {
	getPieces: () => ipcRenderer.invoke('get-pieces')
});
