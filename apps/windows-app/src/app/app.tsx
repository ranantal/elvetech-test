import { AppShell } from '@elvetech/shell';
import type { PlatformServices } from '@elvetech/platform';
import { ElectronDownloader } from './ElectronDownloader';

const services: PlatformServices = { download: new ElectronDownloader() };

export function App() {
  return <AppShell services={services} />;
}

export default App;
