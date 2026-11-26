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
define(['./workbox-43e44e5a'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "pwa-maskable-512x512.png",
    "revision": "3462a6fa87f256348fe5edab36cdddea"
  }, {
    "url": "pwa-512x512.png",
    "revision": "8163d5deaf2135f1c73cbf823b8017e9"
  }, {
    "url": "pwa-192x192.png",
    "revision": "9546aaa0250f9e93b8ba75d536c7d8f3"
  }, {
    "url": "index.html",
    "revision": "2417a8673284794d6b3c169e601c9809"
  }, {
    "url": "icon.svg",
    "revision": "1cc1fc8e8154c37228102725ae3e6cf0"
  }, {
    "url": "firebase-messaging-sw.js",
    "revision": "db908dd1dc3d18dd0eefec0fc1e57bef"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "7bd7f0959cb62d89f68f939204aae737"
  }, {
    "url": "app-logo.png",
    "revision": "c16a0a89a26e6859dd0bc9efc8a2f68a"
  }, {
    "url": "assets/index-Dr0dEiy4.css",
    "revision": null
  }, {
    "url": "assets/index-DW5ejg0A.js",
    "revision": null
  }, {
    "url": "app-logo.png",
    "revision": "c16a0a89a26e6859dd0bc9efc8a2f68a"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "7bd7f0959cb62d89f68f939204aae737"
  }, {
    "url": "firebase-messaging-sw.js",
    "revision": "db908dd1dc3d18dd0eefec0fc1e57bef"
  }, {
    "url": "icon.svg",
    "revision": "1cc1fc8e8154c37228102725ae3e6cf0"
  }, {
    "url": "pwa-192x192.png",
    "revision": "9546aaa0250f9e93b8ba75d536c7d8f3"
  }, {
    "url": "pwa-512x512.png",
    "revision": "8163d5deaf2135f1c73cbf823b8017e9"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "3462a6fa87f256348fe5edab36cdddea"
  }, {
    "url": "manifest.webmanifest",
    "revision": "06bdb588646de0da0bd42d6ec501deb7"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("/index.html"), {
    denylist: [/^\/firebase-messaging-sw\.js$/, /^\/__\//]
  }));
  workbox.registerRoute(/^https:\/\/(?:firestore|identitytoolkit|securetoken|firebase)\.googleapis\.com\/.*/i, new workbox.NetworkOnly(), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
