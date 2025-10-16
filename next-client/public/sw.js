// Service Worker für Push Notifications
// Konfigurierbarer Service Worker

const defaultConfig = {
    appUrl: '/readMails',
    defaultIcon: '/icon-192x192.png',
    defaultBadge: '/badge-72x72.png',
    actions: [
        {
            action: 'open',
            title: 'Öffnen',
            icon: '/open-icon.png'
        },
        {
            action: 'close',
            title: 'Schließen',
            icon: '/close-icon.png'
        }
    ]
};

// Service Worker Factory
function createServiceWorker(config = defaultConfig) {
    // Service Worker Installation
    self.addEventListener('install', function(event) {
        console.log('Service Worker: Installiert');
        event.waitUntil(self.skipWaiting());
    });

    // Service Worker Aktivierung
    self.addEventListener('activate', function(event) {
        console.log('Service Worker: Aktiviert');
        event.waitUntil(self.clients.claim());
    });

    // Push-Nachrichten empfangen
    self.addEventListener('push', function(event) {
        console.log('Service Worker: Push-Nachricht empfangen');
        
        let data = {};
        if (event.data) {
            data = event.data.json();
        }
        
        const options = {
            body: data.body || 'Neue Benachrichtigung',
            icon: data.icon || config.defaultIcon,
            badge: data.badge || config.defaultBadge,
            tag: data.tag || 'default',
            data: data.data || {},
            actions: data.actions || config.actions,
            requireInteraction: data.requireInteraction !== false,
            silent: data.silent || false
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title || 'Neue Benachrichtigung', options)
        );
    });

    // Notification Click Handler
    self.addEventListener('notificationclick', function(event) {
        console.log('Service Worker: Notification geklickt');
        
        event.notification.close();
        
        if (event.action === 'open') {
            event.waitUntil(
                self.clients.openWindow(config.appUrl)
            );
        } else if (event.action === 'close') {
            // Notification schließen (bereits gemacht)
            return;
        } else {
            // Standard Click - öffne App
            event.waitUntil(
                self.clients.openWindow(config.appUrl)
            );
        }
    });

    // Background Sync (für Offline-Funktionalität)
    self.addEventListener('sync', function(event) {
        console.log('Service Worker: Background Sync');
        
        if (event.tag === 'background-sync') {
            event.waitUntil(
                // Hier könntest du Offline-Daten synchronisieren
                Promise.resolve(console.log('Background Sync ausgeführt'))
            );
        }
    });

    // Message Handler (für Kommunikation mit Frontend)
    self.addEventListener('message', function(event) {
        console.log('Service Worker: Nachricht empfangen', event.data);
        
        if (event.data && event.data.type === 'SKIP_WAITING') {
            self.skipWaiting();
        }
    });
}

// Service Worker initialisieren
createServiceWorker();