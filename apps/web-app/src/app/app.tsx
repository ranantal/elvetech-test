import { AppRoot } from '@elvetech/shell';
import { CachedSearchService } from '@elvetech/data-access';
import type { PlatformServices } from '@elvetech/platform';
import { WebDownloader } from './WebDownloader';
import { SearchService } from './SearchService';

const services: PlatformServices = {
  download: new WebDownloader(),
  search: new CachedSearchService(new SearchService()),
};

export function App() {
  return <AppRoot services={services} />;
}

export default App;
