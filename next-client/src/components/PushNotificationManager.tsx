"use client"
import { useEffect } from 'react'
import { PushNotificationer } from '../../myLibUI/Backend/serviceWorker/frontend'
export function PushNotificationManager() {
    useEffect(() => {
        new PushNotificationer("/sw.js")
    }, [])
    return null
}
