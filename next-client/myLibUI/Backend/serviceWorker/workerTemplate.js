export class ServiceWorker {
    constructor(){
        self.addEventListener('install', function(event) {
            console.log('Service Worker: Installiert');
            event.waitUntil(self.skipWaiting());
        });
    
        self.addEventListener('activate', function(event) {
            console.log('Service Worker: Aktiviert');
            event.waitUntil(self.clients.claim());
        }); 
    }

    handlePush({openIcon,closingIcon}){
        self.addEventListener('push', function(event) {
            console.log('Service Worker: Push empfangen');
            
            // Daten vom Server parsen
            let data = {};
            if (event.data) {
                data = event.data.json();
            }
            
            // Notification Options zusammenbauen
            const options = {
                body: data.body || 'Neue Benachrichtigung',
                icon: data.icon || '/icon-192x192.png',
                badge: data.badge || '/icon-192x192.png',
                tag: data.tag || 'default',
                data: data.data || {},
                actions: data.actions || [
                    {
                        action: 'open',
                        title: 'Öffnen',
                        icon: openIcon
                    },
                    {
                        action: 'close',
                        title: 'Schließen',
                        icon: closingIcon
                    }
                ],
                requireInteraction: data.requireInteraction !== false,
                silent: data.silent || false
            };
            
            event.waitUntil(
                self.registration.showNotification(
                    data.title || 'Neue Benachrichtigung', 
                    options
                )
            );
        });
    }
    
    onNotificationClick(sendTo){
        self.addEventListener('notificationclick', function(event) {
            console.log('Service Worker: Notification geklickt');
            
            event.notification.close();
            
            if (event.action === 'open') {
                event.waitUntil(
                    self.clients.openWindow(sendTo)
                );
            } else if (event.action === 'close') {
                return;
            } else {
                event.waitUntil(
                    self.clients.openWindow(sendTo)
                );
            }
        });
    }
}


