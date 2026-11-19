/* Firebase Cloud Messaging Service Worker for Background Push Notifications */
importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCoWls97XvKk5ikKTc3AncUeBHbK0jF89c',
  authDomain: 'gen-lang-client-0159529640.firebaseapp.com',
  projectId: 'gen-lang-client-0159529640',
  storageBucket: 'gen-lang-client-0159529640.firebasestorage.app',
  messagingSenderId: '520990081763',
  appId: '1:520990081763:web:75457a285a02fbbfecfbd6',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload?.notification?.title || payload?.data?.title || 'إشعار جديد - المنصة التعليمية';
  const notificationOptions = {
    body: payload?.notification?.body || payload?.data?.body || 'يوجد تحديث أو تنبيه جديد في البوابة التعليمية.',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    dir: 'rtl',
    lang: 'ar',
    data: {
      url: payload?.data?.targetUrl || payload?.fcmOptions?.link || '/',
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          if (targetUrl && targetUrl !== '/') {
            client.navigate(targetUrl);
          }
          return;
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
