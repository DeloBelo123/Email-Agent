"use client"

import { useEffect } from 'react'

export function PushNotificationManager() {
    useEffect(() => {
        // Silent Component - wie StatusManager
        // Registriert Service Worker einmalig beim ersten Render
        registerPushNotifications()
    }, [])

    const registerPushNotifications = async () => {
        try {
            // Prüfe ob Service Worker und Push Notifications unterstützt werden
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                console.log('Push Notifications werden nicht unterstützt')
                return
            }

            // Service Worker registrieren
            const registration = await navigator.serviceWorker.register('/sw.js')
            console.log('✅ Service Worker registriert:', registration)

            // Permission prüfen und anfragen
            let permission = Notification.permission
            if (permission === 'default') {
                permission = await Notification.requestPermission()
            }

            if (permission === 'granted') {
                // Push Subscription erstellen
                await subscribeToPush(registration)
            } else {
                console.log('❌ Push Notifications nicht erlaubt')
            }
        } catch (error) {
            console.error('❌ Push Notification Setup fehlgeschlagen:', error)
        }
    }

    const subscribeToPush = async (registration: ServiceWorkerRegistration) => {
        try {
            // VAPID Public Key (sollte aus Environment kommen)
            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_KEY || 'your_vapid_public_key_here'
            
            // Prüfe ob VAPID Key gültig ist
            if (vapidPublicKey === 'your_vapid_public_key_here') {
                console.log('⚠️ VAPID Key nicht konfiguriert - Push Notifications deaktiviert')
                return
            }
            
            // Push Subscription erstellen
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
            })

            // Subscription an Backend senden
            await sendSubscriptionToBackend(subscription)
            
            console.log('✅ Push Subscription erstellt und gespeichert')
        } catch (error) {
            console.error('❌ Push Subscription fehlgeschlagen:', error)
        }
    }

    const sendSubscriptionToBackend = async (subscription: PushSubscription) => {
        try {
            const response = await fetch('http://localhost:8000/save_subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscription: subscription,
                    user_id: 'current_user_id' // Sollte aus Auth kommen
                })
            })

            if (response.ok) {
                console.log('✅ Subscription erfolgreich an Backend gesendet')
            } else {
                console.error('❌ Fehler beim Speichern der Subscription')
            }
        } catch (error) {
            console.error('❌ Fehler beim Senden der Subscription:', error)
        }
    }

    // VAPID Key Converter
    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4)
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/')

        const rawData = window.atob(base64)
        const outputArray = new Uint8Array(rawData.length)

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i)
        }
        return outputArray
    }

    // Silent Component - keine UI
    return null
}
