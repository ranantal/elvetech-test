import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: process.versions,
  downloadFile: (url: string, filename: string) =>
    ipcRenderer.invoke('download-file', url, filename),
});
