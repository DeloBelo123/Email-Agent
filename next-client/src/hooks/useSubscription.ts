"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../myLibUI/Backend/supabase/supabase'

interface Subscription {
  tier: 'starter' | 'advanced' | 'premium'
  status: 'active' | 'cancelled' | 'trial'
  expires_at: string | null
  is_active: boolean
  usage: {
    emails_read: number
    emails_generated: number
    background_processing_minutes: number
  }
  limits: {
    emails_read: number
    emails_generated: number
    background_processing: boolean
    crm_integration: boolean
  }
}

const SUBSCRIPTION_LIMITS = {
  starter: {
    emails_read: 200,
    emails_generated: 100,
    background_processing: false,
    crm_integration: false
  },
  advanced: {
    emails_read: 1000,
    emails_generated: 500,
    background_processing: false,
    crm_integration: true
  },
  premium: {
    emails_read: -1, // Unlimited
    emails_generated: -1, // Unlimited
    background_processing: true,
    crm_integration: true
  }
}

export default function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      // Get user subscription from DB
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      // Get current month usage
      const currentMonth = new Date().toISOString().slice(0, 7) + '-01'
      const { data: usageData } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', currentMonth)
        .single()

      const tier = (userData?.subscription_tier as keyof typeof SUBSCRIPTION_LIMITS) || 'starter'
      const limits = SUBSCRIPTION_LIMITS[tier]

      setSubscription({
        tier,
        status: userData?.subscription_status || 'active',
        expires_at: userData?.subscription_expires_at,
        is_active: userData?.subscription_status === 'active',
        usage: {
          emails_read: usageData?.emails_read || 0,
          emails_generated: usageData?.emails_generated || 0,
          background_processing_minutes: usageData?.background_processing_minutes || 0
        },
        limits
      })
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscription()
  }, [])

  const canUseFeature = (feature: keyof typeof SUBSCRIPTION_LIMITS.starter) => {
    if (!subscription) return false
    
    const limit = subscription.limits[feature]
    if (typeof limit === 'boolean') {
      return limit
    }
    
    if (limit === -1) return true // Unlimited
    
    const usage = subscription.usage[feature as keyof typeof subscription.usage] as number
    return usage < limit
  }

  const getUsagePercentage = (feature: 'emails_read' | 'emails_generated') => {
    if (!subscription) return 0
    
    const limit = subscription.limits[feature]
    if (limit === -1) return 0 // Unlimited
    
    const usage = subscription.usage[feature]
    return (usage / limit) * 100
  }

  const isUnlimited = (feature: keyof typeof SUBSCRIPTION_LIMITS.starter) => {
    if (!subscription) return false
    return subscription.limits[feature] === -1
  }

  return {
    subscription,
    loading,
    canUseFeature,
    getUsagePercentage,
    isUnlimited,
    refetch: fetchSubscription
  }
}
