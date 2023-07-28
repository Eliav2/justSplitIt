/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-fc5f5acf'], (function (workbox) { 'use strict';

  self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "assets/App-c807cd8e.js",
    "revision": null
  }, {
    "url": "assets/index-0aede822.js",
    "revision": null
  }, {
    "url": "assets/index-1320b41e.js",
    "revision": null
  }, {
    "url": "assets/index-36c6f285.js",
    "revision": null
  }, {
    "url": "assets/index-96970796.js",
    "revision": null
  }, {
    "url": "assets/index-9bc07c1e.js",
    "revision": null
  }, {
    "url": "assets/index-a2c9b21d.js",
    "revision": null
  }, {
    "url": "assets/index-ae79567f.js",
    "revision": null
  }, {
    "url": "assets/index-d4cddabc.js",
    "revision": null
  }, {
    "url": "assets/index-ff3c72c2.js",
    "revision": null
  }, {
    "url": "assets/index.module-43691236.js",
    "revision": null
  }, {
    "url": "assets/Meta-a538fe93.js",
    "revision": null
  }, {
    "url": "assets/Root-83afc61a.js",
    "revision": null
  }, {
    "url": "assets/workbox-window.prod.es5-a7b12eab.js",
    "revision": null
  }, {
    "url": "index.html",
    "revision": "303dbf11e929e410c1708a86cba8f114"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "410d328b07c46ddbe9a2e7cb29aa70da"
  }, {
    "url": "assets/mui-3fef0fab.svg",
    "revision": null
  }, {
    "url": "assets/pwa-b67007b6.svg",
    "revision": null
  }, {
    "url": "assets/react_ed-bc50972b.svg",
    "revision": null
  }, {
    "url": "assets/recoil-79a62d7b.svg",
    "revision": null
  }, {
    "url": "assets/rr-0b77abf9.svg",
    "revision": null
  }, {
    "url": "assets/ts-849f5fbf.svg",
    "revision": null
  }, {
    "url": "assets/vite-63a26457.svg",
    "revision": null
  }, {
    "url": "audit.png",
    "revision": "4e06993eed49427f321924f5441942bf"
  }, {
    "url": "bundle.png",
    "revision": "9f0f2831f95d176ff29e2ef2ef94d0ed"
  }, {
    "url": "cover.png",
    "revision": "1df4043c45d5bb3e7cfaa413f24ec0f2"
  }, {
    "url": "demo-dark.png",
    "revision": "02bd120430604874b8daa043b5305edf"
  }, {
    "url": "demo-light.png",
    "revision": "2d500252e78cdb3d463788942aab219b"
  }, {
    "url": "favicon.svg",
    "revision": "1d63cc3476f55e13ee57fff67a6fd741"
  }, {
    "url": "file-folder-structure.png",
    "revision": "6d40a900cc13f62f95701d7fb58dd1d6"
  }, {
    "url": "pwa-192x192.png",
    "revision": "3b6265c5e75ae1c1fd666d575f33884b"
  }, {
    "url": "pwa-512x512.png",
    "revision": "e571b86ade2a8bda44002d5903cae102"
  }, {
    "url": "pwa-reload.png",
    "revision": "0b6b77eb7dbc9ee80eb9e7054731e0d6"
  }, {
    "url": "use-template.png",
    "revision": "22633ffac72d95c35b8f2a6ee15df6b2"
  }, {
    "url": "favicon.svg",
    "revision": "1d63cc3476f55e13ee57fff67a6fd741"
  }, {
    "url": "favicon.ico",
    "revision": "eb5b87164c9be3cb704a1ac547f2c51d"
  }, {
    "url": "robots.txt",
    "revision": "987497bfb623e1059632e5a607d56454"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "410d328b07c46ddbe9a2e7cb29aa70da"
  }, {
    "url": "pwa-192x192.png",
    "revision": "3b6265c5e75ae1c1fd666d575f33884b"
  }, {
    "url": "pwa-512x512.png",
    "revision": "e571b86ade2a8bda44002d5903cae102"
  }, {
    "url": "manifest.webmanifest",
    "revision": "d900914d04a4fc77e047664614416183"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
