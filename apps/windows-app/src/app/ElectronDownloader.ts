import type { DownloadHandler } from '@elvetech/platform';

interface ElectronDownloadApi {
  downloadFile(url: string, filename: string): Promise<void>;
}

declare global {
  interface Window {
    electronAPI?: ElectronDownloadApi;
  }
}

export class ElectronDownloader implements DownloadHandler {
  async download(url: string, filename: string): Promise<void> {
    if (!window.electronAPI) {
      throw new Error('electronAPI is not available on window');
    }

    await window.electronAPI.downloadFile(url, filename);
  }
}
