import type { DownloadHandler } from '@elvetech/platform';

export class WebDownloader implements DownloadHandler {
  async download(url: string, filename: string): Promise<void> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Download request failed: ${response.status} ${response.statusText}`,
      );
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(objectUrl);
  }
}
