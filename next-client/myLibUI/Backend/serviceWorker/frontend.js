import axios from 'axios';
import { supabase } from '../supabase/supabase';
export class PushNotificationer {
    constructor(){
        this.registration = undefined;
        this.permission = false;
    }
    async permission(){
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('✅ Notification erlaubt');
            this.permission = true
        } else {
            console.error('❌ Notification nicht erlaubt');
            this.permission = false
        }
    }
    async register(path = '/sw.js') {
        try {
            const registration = await navigator.serviceWorker.register(path);
            console.log('✅ SW registriert:', registration);
            this.registration = registration;
        } catch (error) {
            console.error('❌ SW Registrierung fehlgeschlagen:', error);
        }
    }
    async subscribe(backendUrl){
        if (!this.permission) throw new Error('❌ Notification nicht erlaubt, kann nicht subscriben');
        if (!this.registration) throw new Error('❌ SW nicht registriert, kann nicht subscriben');
        const subscription = await this.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.VAPID_PUBLIC_KEY) //überlege dir diese Logik hier aber nochmal neu bro, lass cursor eine vapi-key api machen oderso
        });
        console.log('✅ Subscription erstellt:', subscription);
        const { data: { user },error:userError } = await supabase.auth.getUser();
        if(userError) throw new Error('❌ konnte nicht user von der Session holen, kann nicht subscriben');
        const respo = await axios.post(backendUrl,{
            user_id:user.id,
            subscription:subscription
        })
        return respo
    }
}