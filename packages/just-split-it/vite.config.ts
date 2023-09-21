import * as path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

import manifest from './manifest.json';
import fs from 'fs';

// console.log(`process.env['VITE_START_URL']`, process.env['VITE_START_URL']);
// console.log(process.env);
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  console.log('mode', mode);
  console.log('loadEnv(mode, process.cwd())', loadEnv(mode, process.cwd()));
  console.log(`process.env['START_URL']`, process.env['START_URL']);

  return {
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
        manifest: { ...manifest, start_url: process.env['START_URL'] ?? '/' },
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
  };
});
