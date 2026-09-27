const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("novaDesktop", {
  platform: process.platform,
  version: "0.2.0",
  getPath: (key) => ipcRenderer.invoke("novacut:get-path", key),
  saveProject: (name, contents) => ipcRenderer.invoke("novacut:save-project", name, contents)
});
