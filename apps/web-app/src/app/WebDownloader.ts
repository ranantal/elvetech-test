import type { DownloadHandler } from '@elvetech/platform';

export class WebDownloader implements DownloadHandler {
  async download(url: string, filename: string): Promise<void> {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(objectUrl);
  }
}
