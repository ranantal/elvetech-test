import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: process.versions,
  downloadFile: (url: string, filename: string) =>
    ipcRenderer.invoke('download-file', url, filename),
  search: (query: string, requestId: string) =>
    ipcRenderer.invoke('search', query, requestId),
  cancelSearch: (requestId: string) =>
    ipcRenderer.send('cancel-search', requestId),
});
