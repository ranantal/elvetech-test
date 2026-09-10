import { app, BrowserWindow, protocol, ipcMain, dialog } from 'electron';
import * as path from 'node:path';
// Deliberately not "node:fs/promises": Electron's asar-aware fs patch
// intercepts the bare "fs" specifier, and the "node:"-prefixed form can
// bypass it, breaking reads from inside app.asar in the packaged build.
import { readFile, writeFile } from 'fs/promises';

// Chromium blocks ES module scripts (`<script type="module">`, used by the
// Vite build) from loading over file://, so the built renderer is served
// through a privileged custom scheme instead. See:
// https://www.electronjs.org/docs/latest/api/protocol#protocolregisterschemesasprivilegedcustomschemes
const APP_SCHEME = 'app';
const RENDERER_DIR = path.join(__dirname, '../dist/renderer');

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_SCHEME,
    privileges: { standard: true, secure: true, supportFetchAPI: true },
  },
]);

function registerAppProtocol(): void {
  protocol.handle(APP_SCHEME, async (request) => {
    // `new URL("app://index.html")` would parse "index.html" as the host,
    // not the path, leaving pathname empty. Always navigating to a fixed
    // "bundle" host keeps everything after it in `pathname`.
    const { pathname } = new URL(request.url);
    const relativePath = decodeURIComponent(
      pathname === '' || pathname === '/' ? '/index.html' : pathname,
    );
    const filePath = path.join(RENDERER_DIR, relativePath);

    try {
      const data = await readFile(filePath);
      const contentType =
        MIME_TYPES[path.extname(filePath)] ?? 'application/octet-stream';
      return new Response(new Uint8Array(data), {
        headers: { 'content-type': contentType },
      });
    } catch {
      return new Response('Not found', { status: 404 });
    }
  });
}

// The renderer runs with nodeIntegration disabled, so it can't write to
// disk itself — it asks the main process to do it via this handler, which
// the preload script exposes as window.electronAPI.downloadFile.
function registerDownloadHandler(): void {
  ipcMain.handle(
    'download-file',
    async (_event, url: string, filename: string) => {
      const response = await fetch(url);
      const buffer = Buffer.from(await response.arrayBuffer());

      const { canceled, filePath } = await dialog.showSaveDialog({
        defaultPath: filename,
      });

      if (canceled || !filePath) {
        return;
      }

      await writeFile(filePath, buffer);
    },
  );
}

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'Elvetech',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const devServerUrl = process.env['ELECTRON_RENDERER_URL'];

  if (!app.isPackaged && devServerUrl) {
    win.loadURL(devServerUrl);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadURL(`${APP_SCHEME}://bundle/index.html`);
  }
}

app.whenReady().then(() => {
  registerAppProtocol();
  registerDownloadHandler();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
