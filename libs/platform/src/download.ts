export interface DownloadHandler {
  download(url: string, filename: string): Promise<void>;
}
