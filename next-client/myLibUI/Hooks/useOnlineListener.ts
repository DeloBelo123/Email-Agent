"use client"
import { useEffect } from "react"

interface useOnlineListenerProps {
  onOnline: (...args: any[]) => void
  onOffline: (...args: any[]) => void
}

export default function useOnlineListener({onOnline, onOffline}: useOnlineListenerProps) {
  
  useEffect(() => {

    const handleOnline = () => {
      console.log("User came ONLINE")
      onOnline()
    }
    
    const handleOffline = () => {
      console.log("User went OFFLINE")
      onOffline()
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    if (navigator.onLine) {
      console.log("Initial status: ONLINE")
      onOnline()
    } else {
      console.log("Initial status: OFFLINE")
      onOffline()
    }
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [onOnline, onOffline])
}