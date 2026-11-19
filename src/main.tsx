import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

if (import.meta.env.DEV) {
  // Clean up any stale sw.js / dev-sw.js registrations from earlier builds so old cached bundles never override dev UI
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        const scriptUrl =
          registration.active?.scriptURL ||
          registration.waiting?.scriptURL ||
          registration.installing?.scriptURL ||
          '';
        if (scriptUrl.includes('dev-sw.js') || scriptUrl.endsWith('/sw.js')) {
          registration.unregister();
        }
      });
    });
  }
  if ('caches' in window) {
    caches.keys().then((keys) => {
      keys.forEach((key) => {
        if (key.includes('workbox')) {
          caches.delete(key);
        }
      });
    });
  }
} else {
  // Register Service Worker in production builds for full offline PWA support
  registerSW({
    immediate: true,
    onOfflineReady() {
      console.info('التطبيق جاهز للعمل.');
    },
  });
}

createRoot(document.getElementById('root')!).render(<App />);
