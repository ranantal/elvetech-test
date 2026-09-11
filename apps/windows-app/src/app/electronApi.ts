export interface ElectronApi {
  downloadFile(url: string, filename: string): Promise<void>;
  search<T>(query: string): Promise<T[]>;
}

declare global {
  interface Window {
    electronAPI?: ElectronApi;
  }
}
