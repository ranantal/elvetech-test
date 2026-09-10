/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

const workspaceRoot = path.resolve(import.meta.dirname, '../..');

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/web-app',
  // .env lives at the workspace root (shared with windows-app), not in this
  // app's own root.
  envDir: workspaceRoot,
  server: {
    port: 4200,
    host: 'localhost',
    // Libs live outside this app's own root (apps/web-app), so Vite must be
    // told it's allowed to serve files from there.
    fs: {
      allow: [workspaceRoot],
    },
    proxy: {
      '/api': {
        target: 'https://service.test.elvetech.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  resolve: {
    // Libs are consumed as source, not as built packages: no dist to go
    // stale, no separate build step to run before the dev server picks up
    // a change. Vite transforms libs/*/src the same way it does app code,
    // so edits show up through the normal module graph/HMR.
    alias: {
      '@elvetech/ui': path.resolve(workspaceRoot, 'libs/ui/src/index.ts'),
      '@elvetech/shell': path.resolve(workspaceRoot, 'libs/shell/src/index.ts'),
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
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    name: 'web-app',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
