// src/components/OnlineStatusManager.tsx
"use client"

import { useCallback } from 'react'
import useOnlineListener from '../../myLibUI/Hooks/useOnlineListener'
import { sendSession,supabase } from '../../myLibUI/Backend/supabase/supabase'
import { userTabelle } from '../../myLibUI/Backend/supabase/sb_tables'

export function OnlineStatusManager() {
  
  const handleOnline = useCallback(async () => {
    try {
      const { data: { user }, error:onlineError } = await supabase.auth.getUser()
      if (onlineError) {
        console.warn("User nicht authentifiziert - Online Status Update übersprungen")
        return
      }

      if (!user?.id) {
        console.warn("Keine User ID verfügbar - Online Status Update übersprungen")
        return
      }

      await userTabelle.update({
        update:{ OnOff:"on" },
        where:[{column:"user_id",is:user.id}]
      })
      await sendSession({
        toBackend: "http://localhost:8000/handle_user_status/test3"
      })
    } catch (error) {
      console.error("Error in handleOnline:", error)
    }
  }, [])
  
  const handleOffline = useCallback(async () => {
    try {
      const { data: { user }, error:offlineError } = await supabase.auth.getUser()
      if (offlineError) {
        console.warn("User nicht authentifiziert - Offline Status Update übersprungen")
        return
      }

      if (!user?.id) {
        console.warn("Keine User ID verfügbar - Offline Status Update übersprungen")
        return
      }
      
      await userTabelle.update({
        update:{ OnOff:"off" },
        where:[{column:"user_id",is:user.id}]
      })
      await sendSession({
        toBackend: "http://localhost:8000/handle_user_status/test3"
      }) 
    } catch (error) {
      console.error("Error in handleOffline:", error)
    }
  }, [])
  
  useOnlineListener({ onOnline: handleOnline, onOffline: handleOffline })
  
  return null 
}
