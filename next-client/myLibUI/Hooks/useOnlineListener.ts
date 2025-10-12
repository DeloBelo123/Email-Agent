"use client"
import { useEffect, useRef } from "react"
/**
 * dieser Hook verfolgt den online status des nutzers und führt eine function bei der änderung aus
 * @param onStatusChange das ist eine callback function die bei jeder änderung des online status ausgeführt wird, z.b. um daten zu syncen
 * @returns None, ist ein reiner side-effect hook
 */
export default function useOnlineListener(onStatusChange:(...args: any[]) => void){
    const isInitialMount = useRef(true)
    useEffect(()=>{
        const handleStatusChange = () => {
            if (!isInitialMount.current) {
                console.log("Online status changed:", navigator.onLine)
                onStatusChange()
            } else {
                isInitialMount.current = false
            }
        }

        window.addEventListener('online', handleStatusChange);
        window.addEventListener('offline', handleStatusChange);

        return () => {
            window.removeEventListener('online', handleStatusChange);
            window.removeEventListener('offline', handleStatusChange);
        }
    },[onStatusChange])
}