import type { DownloadHandler } from './download';

// One bag of platform-dependent capabilities instead of one per capability —
// adding another later is a new field here, not a new type/prop everywhere
// that needs it.
export interface PlatformServices {
  download: DownloadHandler;
}
