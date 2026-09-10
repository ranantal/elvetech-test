import { AppRoot } from '@elvetech/shell';
import type { PlatformServices } from '@elvetech/platform';
import { ElectronDownloader } from './ElectronDownloader';

const services: PlatformServices = { download: new ElectronDownloader() };

export function App() {
  return <AppRoot services={services} />;
}

export default App;
