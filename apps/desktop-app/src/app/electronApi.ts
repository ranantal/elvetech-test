export interface ElectronApi {
  downloadFile(url: string, filename: string): Promise<void>;
  search<T>(query: string, requestId: string): Promise<T[]>;
  cancelSearch(requestId: string): void;
}

declare global {
  interface Window {
    electronAPI?: ElectronApi;
  }
}
