import { NotificationsProvider } from '@elvetech/ui';
import {
  PlatformServicesProvider,
  type PlatformServices,
} from '@elvetech/platform';
import { AppShell } from './AppShell';

export interface AppRootProps {
  services: PlatformServices;
}

export function AppRoot({ services }: AppRootProps) {
  return (
    <PlatformServicesProvider services={services}>
      <NotificationsProvider>
        <AppShell />
      </NotificationsProvider>
    </PlatformServicesProvider>
  );
}

export default AppRoot;
