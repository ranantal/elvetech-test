# Elvetech

A cross-platform image search app — web (Vite SPA) and desktop (Electron) — built from one shared Nx workspace. A query fires two searches ("query" and "query graffiti") against a third-party image service and merges them client-side into a feed of paired posts.

## Workspace layout

```
apps/
  web-app/       Vite SPA
  desktop-app/   Electron app (Windows + macOS)
libs/
  ui/            Presentational React components (Feed, Item, Post, SearchBar, ...)
  shell/         Composition layer — AppRoot/AppShell, useSearch, useHistory
  data-access/   Search caching/history (IndexedDB) — no React, no platform knowledge
  platform/      Platform-service abstraction (Searcher, DownloadHandler) + React Context
```

`ui`, `shell`, and `data-access` are consumed as source via Vite aliases (`resolve.alias` + TS `paths`), not as built packages — editing a lib shows up immediately in both apps' dev servers, no separate build step.

## What's shared vs. platform-specific

Everything product-facing is shared: the whole feed/search/history/cache UI (`libs/ui`, `libs/shell`), the caching and history logic (`libs/data-access`), notifications, layout — all of it runs unmodified on both web and desktop.

The only things that differ by platform are the two capabilities that *can't* be implemented the same way in a browser tab vs. an Electron renderer: **running a search request** and **saving a file to disk**. Both are expressed as small interfaces in `libs/platform` (`Searcher`, `DownloadHandler`), bundled into one `PlatformServices` object, and provided once per app via `PlatformServicesProvider`. Everything in `libs/ui`/`libs/shell` only ever depends on those interfaces — never on a concrete web or Electron implementation.

| Capability | Web (`apps/web-app`) | Desktop (`apps/desktop-app`) | Why they differ |
|---|---|---|---|
| Search transport | `SearchService` — plain `fetch('/api/search?q=...')` | `ElectronSearchService` — IPC call to the Electron **main process**, which does the `fetch` itself | A browser tab is subject to CORS and can't hide the API token in its own bundle, so the web request has to go through a proxy that injects the token server-side. Electron's main process is a plain Node process — no CORS, no bundle to leak a secret into — so it can call the third-party service directly. This also means the desktop app doesn't depend on any web deployment being up to search. |
| File export | `WebDownloader` — fetches the image as a blob, downloads it via an object URL + a synthetic `<a download>` click | `ElectronDownloader` — IPC call to the main process, which shows a native "Save As" dialog and writes the file | The renderer runs with `contextIsolation`/`nodeIntegration: false`, so it can't touch the filesystem at all; only the main process can. A plain `<a download>` is also unreliable for cross-origin images in a browser, hence the blob/object-URL approach there. |

Both concrete implementations live in their respective app (`apps/web-app/src/app/`, `apps/desktop-app/src/app/`), not in a shared lib — they're single-consumer, platform-private code, not something to reuse.

### The proxy / API token

The third-party service requires an `x-api-token` header. That token is never shipped in the web client bundle:

- **Web, dev**: the Vite dev-server proxy (`apps/web-app/vite.config.mts`) forwards `/api/*` to the real service and injects the header server-side (config code runs in Node, not the client).
- **Web, production**: `api/search.ts`, a Vercel Function, does the same job — see [Deployment](#deployment).
- **Desktop**: the token is read from a bundled `.env` file (via `dotenv`, loaded in `electron/main.ts`) and used directly in the main process's own `fetch`.

Note this isn't "secret" in the cryptographic sense on desktop — anything shipped inside a distributable Electron app can be extracted by a determined user (the `.env` file sits in the app's resources, unpacked). It's kept out of the *web* bundle specifically because that's served to arbitrary browsers over the network; a local desktop install is a different threat model.

## Caching and history

Two independent mechanisms, both IndexedDB-backed (`libs/data-access`):

- **`SearchCache`** — every query's results are cached for **1 hour**. A repeated query within that window never hits the third-party service.
- **`SearchHistory`** — the last 5 distinct queries, independent of caching, used to populate the search bar's history dropdown and to restore the last query on startup.

Restoring state on startup/reload (last query, feed, history) is done with the cache forced to `cacheOnly` mode — if the cached entry expired or is missing, the app shows an empty feed rather than firing a live request, since the requirement is "no requests on restore," not "always show something."

## Getting started

```sh
npm install
cp .env.example .env   # fill in API_TOKEN
```

```sh
npm run web:dev        # web app dev server (http://localhost:4200)
npm run desktop:dev     # Electron app, dev mode
npm run desktop:package  # build a distributable (.exe on Windows, .dmg on macOS — must run on that OS)
```

## Deployment

- **Web**: deployed on Vercel. `api/search.ts` (a Vercel Function, `type: module`, kept out of the Nx project graph via `nx.json`'s plugin `exclude`) proxies search requests and injects the token. Requires an `API_TOKEN` environment variable set in the Vercel project settings (not read from `.env` there).
- **macOS build**: electron-builder can't cross-compile a `.dmg` from Windows, so `.github/workflows/build-mac.yml` builds it on a `macos-latest` GitHub Actions runner and uploads the result as a workflow artifact. Requires an `API_TOKEN` repository secret (Settings → Secrets and variables → Actions). The build is unsigned, so macOS Gatekeeper will warn on first launch — right-click → Open to bypass.
