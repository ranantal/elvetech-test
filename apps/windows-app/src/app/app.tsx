import { AppRoot } from '@elvetech/shell';
import { CachedSearchService } from '@elvetech/data-access';
import type { PlatformServices } from '@elvetech/platform';
import { ElectronDownloader } from './ElectronDownloader';
import { ElectronSearchService } from './ElectronSearchService';

const services: PlatformServices = {
  download: new ElectronDownloader(),
  search: new CachedSearchService(new ElectronSearchService()),
};

export function App() {
  return <AppRoot services={services} />;
}

export default App;
