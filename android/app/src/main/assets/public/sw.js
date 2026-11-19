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
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

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
    "revision": "9e130ad86a6da0bd4f82ccaba5ccba8d"
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
    "url": "assets/index-DOkeGhGn.css",
    "revision": null
  }, {
    "url": "assets/index-C271vgWM.js",
    "revision": null
  }, {
    "url": "assets/aistudio/pedag_psy_d43e3690.jpeg",
    "revision": null
  }, {
    "url": "assets/aistudio/Screenshot_2026-11-17-20-34-44-697_com.dirasam.dirasam1_8bcdef16.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/Screenshot_2026-11-17-20-34-39-463_com.dirasam.dirasam1_f4048e70.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/Screenshot_2026-11-17-20-34-00-198_com.dirasam.dirasam1_8999cf57.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/Screenshot_2026-11-17-20-33-54-776_com.dirasam.dirasam1_3c5d1f49.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/Screenshot_2026-11-17-20-33-48-284_com.dirasam.dirasam1_dc0653e5.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/Screenshot_2026-11-17-20-33-41-898_com.dirasam.dirasam1_5870f382.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/Screenshot_2026-11-17-20-33-35-262_com.dirasam.dirasam1_bec0e975.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/Screenshot_2026-11-17-20-33-29-037_com.dirasam.dirasam1_c51e313d.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/Screenshot_2026-11-17-20-32-59-469_com.dirasam.dirasam1_4c5c94e7.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/Screenshot_2026-11-17-20-32-44-820_com.dirasam.dirasam1_c179c714.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/Screenshot_2026-11-17-20-32-38-645_com.dirasam.dirasam1_d6894138.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/Screenshot_2026-11-17-20-32-33-397_com.dirasam.dirasam1_ecfc130b.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/Screenshot_2026-11-17-20-32-27-782_com.dirasam.dirasam1_3e7d027e.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/Screenshot_2026-11-17-20-31-06-624_com.dirasam.dirasam1_3b4f5357.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/Screenshot_2026-11-13-16-43-53-270_com.android.chrome_e459e38b.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/Screenshot_2026-11-12-23-37-56-253_com.dirasam.dirasam1_eb954954.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/Screenshot_2026-11-12-23-37-50-103_com.dirasam.dirasam1_337c274b.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/IMG_20261118_145242_f8ae7aa1.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/IMG_20261117_203055_8713e7ca.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/IMG_20261117_201154_551a08b5.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/IMG_20261116_170513_6f198368.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/IMG_20261116_170414_22a19e2d.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/IMG_20261116_170349_02f0f5d7.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/IMG_20261116_150623_cfaed555.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/IMG_20261116_150511_ef56bd79.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/IMG_20261116_150449_770dcf04.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/IMG_20261115_231400_e070df3b.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/IMG_20261115_000108_b0e8476c.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/IMG_20261115_000039_ef6511d3.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/IMG_20261113_224703_dbaec9c8.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/IMG_20261113_173514_126a6abf.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/IMG_20261113_164420_d29fdcfd.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/IMG_20261113_164254_e8d1485a.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/IMG_20261113_164228_54430fc3.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/IMG_20261113_164159_cc8829ab.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/IMG_20261112_233154_db1b8818.jpg",
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
    "revision": "03a4fb4e3d5d994320e19c1a3882d4b7"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("/index.html"), {
    denylist: [/^\/firebase-messaging-sw\.js$/]
  }));
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
