import * as path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

import manifest from './manifest.json';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  // mostly for development
  server: {
    host: '0.0.0.0',
    https: {
      key: fs.readFileSync('./https/localhost+1-key.pem'),
      cert: fs.readFileSync('./https/localhost+1.pem'),
      ca: fs.readFileSync('./https/mkcert-ca.pem'),
    },
  },
  build: {
    // ignore the annoying `Module level directives cause errors when bundled, "use client" in <module>` errors
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        warn(warning);
      },
    },
  },

  plugins: [
    svgr(),
    react(),
    VitePWA({
      manifest,
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      // switch to "true" to enable sw on development
      devOptions: {
        enabled: false,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html}', '**/*.{svg,png,jpg,gif}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
