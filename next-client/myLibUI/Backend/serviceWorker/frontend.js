import { supabase } from '../supabase/supabase';
import { userTabelle } from '../supabase/sb_tables';

const vapidKeyPublic = process.env.NEXT_PUBLIC_VAPID_KEY

export class PushNotificationer {
    constructor(pathOfSW){
        this.registration = undefined;
        this.permission = false;
        const handleAll = async() => {
            await this.askPermission()
            await this.register(pathOfSW || "/sw.js")
            await this.subscribe()
        }
        handleAll()
    }
    async askPermission(){
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('✅ Notification erlaubt');
            this.permission = true
        } else {
            console.error('❌ Notification nicht erlaubt');
            this.permission = false
        }
    }
    async register(path) {
        try {
            const registration = await navigator.serviceWorker.register(path);
            console.log('✅ SW registriert:', registration);
            this.registration = registration;
        } catch (error) {
            console.error('❌ SW Registrierung fehlgeschlagen:', error);
        }
    }
    async subscribe(){
        if (!this.permission) console.error('❌ Notification nicht erlaubt, kann nicht subscriben');
        if (!this.registration) throw new Error('❌ SW nicht registriert, kann nicht subscriben');
        const subscription = await this.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey:urlBase64ToUint8Array(vapidKeyPublic)
        });
        console.log('✅ Subscription erstellt:', subscription);
        const { data: { user },error:userError } = await supabase.auth.getUser();
        if(userError) throw new Error('❌ konnte nicht user von der Session holen, kann nicht subscriben');
        await userTabelle.update({
            where:[{column:'user_id',is:user.id}],
            update:{
                subscription:JSON.stringify(subscription)
            }
        })
    }
}

export function urlBase64ToUint8Array(base64String){
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