import type { DownloadHandler } from '@elvetech/platform';
import './electronApi';

// The renderer can't write to disk directly under contextIsolation, so this
// delegates to the main process via the preload bridge (see
// electron/preload.ts + electron/main.ts, the 'download-file' IPC channel).
export class ElectronDownloader implements DownloadHandler {
  async download(url: string, filename: string): Promise<void> {
    if (!window.electronAPI) {
      throw new Error('electronAPI is not available on window');
    }

    await window.electronAPI.downloadFile(url, filename);
  }
}
