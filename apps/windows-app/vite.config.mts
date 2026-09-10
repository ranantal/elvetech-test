import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

const workspaceRoot = path.resolve(import.meta.dirname, '../..');

export default defineConfig(({ mode }) => {
  // Third argument '' loads every var regardless of the VITE_ prefix — this
  // runs in Node (the dev-server config), not the client bundle, so it's
  // fine to read secrets here that must never reach client code.
  const env = loadEnv(mode, workspaceRoot, '');

  return {
    root: import.meta.dirname,
    cacheDir: '../../node_modules/.vite/apps/windows-app',
    // .env lives at the workspace root (shared with web-app), not in this
    // app's own root.
    envDir: workspaceRoot,
    // Electron serves the renderer via a custom protocol, not an absolute
    // "/" origin, so assets must resolve with relative paths.
    base: './',
    server: {
      port: 4201,
      host: 'localhost',
      // Libs live outside this app's own root (apps/windows-app), so Vite
      // must be told it's allowed to serve files from there.
      fs: {
        allow: [workspaceRoot],
      },
      proxy: {
        '/api': {
          target: 'https://service.test.elvetech.io',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          // Injected here, server-side, so the token never ships in the
          // client bundle.
          headers: {
            'x-api-token': env.API_TOKEN,
          },
        },
      },
    },
    preview: {
      port: 4301,
      host: 'localhost',
    },
    resolve: {
      // Libs are consumed as source, not as built packages: no dist to go
      // stale, no separate build step to run before the dev server picks up
      // a change. Vite transforms libs/*/src the same way it does app code,
      // so edits show up through the normal module graph/HMR.
      alias: {
        '@elvetech/ui': path.resolve(workspaceRoot, 'libs/ui/src/index.ts'),
        '@elvetech/shell': path.resolve(
          workspaceRoot,
          'libs/shell/src/index.ts',
        ),
        '@elvetech/data-access': path.resolve(
          workspaceRoot,
          'libs/data-access/src/index.ts',
        ),
        '@elvetech/platform': path.resolve(
          workspaceRoot,
          'libs/platform/src/index.ts',
        ),
      },
    },
    plugins: [react()],
    build: {
      outDir: './dist/renderer',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  };
});
