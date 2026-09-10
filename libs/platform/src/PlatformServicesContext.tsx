import { createContext, useContext, type ReactNode } from 'react';
import type { PlatformServices } from './platformServices';
import type { DownloadHandler } from './download';

const PlatformServicesContext = createContext<PlatformServices | null>(null);

export interface PlatformServicesProviderProps {
  services: PlatformServices;
  children: ReactNode;
}

// `services` should be a stable reference (built once, not recreated on
// every render) — otherwise every consumer of any field re-renders whenever
// its parent does, even if that particular field didn't change.
export function PlatformServicesProvider({
  services,
  children,
}: PlatformServicesProviderProps) {
  return (
    <PlatformServicesContext.Provider value={services}>
      {children}
    </PlatformServicesContext.Provider>
  );
}

export function usePlatformServices(): PlatformServices | null {
  return useContext(PlatformServicesContext);
}

export function useDownloadHandler(): DownloadHandler | null {
  return usePlatformServices()?.download ?? null;
}
