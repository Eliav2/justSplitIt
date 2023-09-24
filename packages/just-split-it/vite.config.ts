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
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

  const start_url = process.env['VITE_START_URL'];
  if (!start_url) throw new Error('VITE_START_URL is not defined');
  const scope = start_url;
  const related_applications = [
    {
      platform: 'webapp',
      url: process.env['VITE_START_URL'] + '/manifest.webmanifest',
    },
  ];

  return {
    // mostly for development
    server: {
      host: '0.0.0.0',
      https: {
        key: fs.readFileSync('./https/localhost+2-key.pem'),
        cert: fs.readFileSync('./https/localhost+2.pem'),
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
        manifest: { ...manifest, start_url, scope, related_applications },
        includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        // switch to "true" to enable sw on development
        devOptions: {
          enabled: false,
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html}', '**/*.{svg,png,jpg,gif,ttf}'],
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
