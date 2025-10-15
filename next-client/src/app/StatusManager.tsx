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
      if (onlineError) throw new Error("hahah, einfach error beim user kriegen in der OnlineStatusManager kompo")

      await userTabelle.update({
        update:{ OnOff:"on" },
        where:[{column:"user_id",is:user?.id}]
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
      if (offlineError) throw new Error("hahah, einfach error beim user kriegen in der OnlineStatusManager kompo")
      
      await userTabelle.update({
        update:{ OnOff:"off" },
        where:[{column:"user_id",is:user?.id}]
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
