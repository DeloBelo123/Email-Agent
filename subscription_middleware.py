"""
Subscription & Usage Middleware für deine Email-SaaS
"""

from fastapi import HTTPException, Request
from functools import wraps
import asyncio
from datetime import datetime, date
from typing import Dict, Any
from pb.agent_modules.my_supabase import supabase

class SubscriptionManager:
    def __init__(self):
        self.usage_limits = {
            'starter': {
                'emails_read': 200,
                'emails_generated': 100,
                'background_processing': False,
                'crm_integration': False
            },
            'advanced': {
                'emails_read': 1000,
                'emails_generated': 500,
                'background_processing': False,
                'crm_integration': True
            },
            'premium': {
                'emails_read': -1,  # Unlimited
                'emails_generated': -1,  # Unlimited
                'background_processing': True,
                'crm_integration': True
            }
        }
    
    async def get_user_subscription(self, user_id: str) -> Dict[str, Any]:
        """Holt User-Subscription aus DB"""
        try:
            result = supabase.table('users').select('*').eq('id', user_id).execute()
            if result.data:
                user = result.data[0]
                return {
                    'tier': user.get('subscription_tier', 'starter'),
                    'status': user.get('subscription_status', 'active'),
                    'expires_at': user.get('subscription_expires_at'),
                    'is_active': self._is_subscription_active(user)
                }
            return {'tier': 'starter', 'status': 'active', 'is_active': True}
        except Exception as e:
            print(f"Error getting subscription: {e}")
            return {'tier': 'starter', 'status': 'active', 'is_active': True}
    
    def _is_subscription_active(self, user: Dict) -> bool:
        """Prüft ob Subscription aktiv ist"""
        if user.get('subscription_status') != 'active':
            return False
        
        expires_at = user.get('subscription_expires_at')
        if expires_at:
            return datetime.now() < datetime.fromisoformat(expires_at.replace('Z', '+00:00'))
        
        return True
    
    async def check_usage_limit(self, user_id: str, action: str, amount: int = 1) -> bool:
        """Prüft ob User noch innerhalb der Limits ist"""
        subscription = await self.get_user_subscription(user_id)
        
        if not subscription['is_active']:
            raise HTTPException(status_code=402, detail="Subscription expired")
        
        tier = subscription['tier']
        limits = self.usage_limits[tier]
        
        # Unlimited features
        if limits[action] == -1:
            return True
        
        # Check current usage
        current_usage = await self.get_current_usage(user_id, action)
        
        return current_usage + amount <= limits[action]
    
    async def get_current_usage(self, user_id: str, action: str) -> int:
        """Holt aktuelle Usage für diesen Monat"""
        try:
            current_month = date.today().replace(day=1)
            result = supabase.table('user_usage').select('*').eq('user_id', user_id).eq('month', current_month).execute()
            
            if result.data:
                usage = result.data[0]
                return usage.get(action, 0)
            return 0
        except Exception as e:
            print(f"Error getting usage: {e}")
            return 0
    
    async def increment_usage(self, user_id: str, action: str, amount: int = 1):
        """Erhöht Usage Counter"""
        try:
            current_month = date.today().replace(day=1)
            
            # Upsert usage record
            supabase.table('user_usage').upsert({
                'user_id': user_id,
                'month': current_month,
                action: await self.get_current_usage(user_id, action) + amount
            }).execute()
        except Exception as e:
            print(f"Error incrementing usage: {e}")

# Global instance
subscription_manager = SubscriptionManager()

def require_subscription_tier(required_tier: str):
    """Decorator für Features die bestimmte Subscription brauchen"""
    tier_levels = {'starter': 1, 'advanced': 2, 'premium': 3}
    
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            user_id = getattr(request.state, 'user_id', None)
            if not user_id:
                raise HTTPException(status_code=401, detail="User not authenticated")
            
            subscription = await subscription_manager.get_user_subscription(user_id)
            
            if not subscription['is_active']:
                raise HTTPException(status_code=402, detail="Subscription expired")
            
            user_tier_level = tier_levels.get(subscription['tier'], 1)
            required_tier_level = tier_levels.get(required_tier, 1)
            
            if user_tier_level < required_tier_level:
                raise HTTPException(
                    status_code=403, 
                    detail=f"This feature requires {required_tier} subscription"
                )
            
            return await func(request, *args, **kwargs)
        return wrapper
    return decorator

def check_usage_limit(action: str, amount: int = 1):
    """Decorator für Usage Limits"""
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            user_id = getattr(request.state, 'user_id', None)
            if not user_id:
                raise HTTPException(status_code=401, detail="User not authenticated")
            
            can_proceed = await subscription_manager.check_usage_limit(user_id, action, amount)
            if not can_proceed:
                raise HTTPException(
                    status_code=429, 
                    detail=f"Usage limit exceeded for {action}"
                )
            
            # Increment usage after successful execution
            result = await func(request, *args, **kwargs)
            await subscription_manager.increment_usage(user_id, action, amount)
            
            return result
        return wrapper
    return decorator
