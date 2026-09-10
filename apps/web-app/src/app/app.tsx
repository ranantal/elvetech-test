import { AppRoot } from '@elvetech/shell';
import type { PlatformServices } from '@elvetech/platform';
import { WebDownloader } from './WebDownloader';

const services: PlatformServices = { download: new WebDownloader() };

export function App() {
  return <AppRoot services={services} />;
}

export default App;
