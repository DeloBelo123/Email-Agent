"""
🚀 BACKEND ENDPOINTS für Push Notifications
==========================================

Diese Datei enthält alle FastAPI Endpoints für Push Notifications.
Einfach in deine main.py importieren und verwenden!
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging
from serviceWorker import handle_subscription_save, get_vapid_public_key, send_notification

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Router für Push Notification Endpoints
router = APIRouter()

# ============================================================================
# 📋 PYDANTIC MODELS
# ============================================================================

class SubscriptionRequest(BaseModel):
    subscription: Dict[str, Any]
    user_id: str

class NotificationRequest(BaseModel):
    user_id: str
    title: str
    body: str
    icon: Optional[str] = "/icon-192x192.png"
    badge: Optional[str] = "/badge-72x72.png"
    image: Optional[str] = None
    tag: Optional[str] = None
    require_interaction: Optional[bool] = False
    silent: Optional[bool] = False
    vibrate: Optional[list] = None
    actions: Optional[list] = None
    data: Optional[Dict[str, Any]] = None
    url: Optional[str] = "/readMails"

# ============================================================================
# 🔧 BACKEND ENDPOINTS
# ============================================================================

@router.get("/vapid-public-key")
async def get_vapid_key():
    """
    🔑 Gibt den VAPID Public Key für das Frontend zurück.
    Das Frontend braucht diesen Key für die Push Subscription.
    """
    try:
        public_key = get_vapid_public_key()
        if not public_key:
            raise HTTPException(status_code=500, detail="VAPID Public Key not configured")
        
        return {"public_key": public_key}
    except Exception as e:
        logging.error(f"❌ Error getting VAPID public key: {e}")
        raise HTTPException(status_code=500, detail="Failed to get VAPID public key")

@router.post("/save_subscription")
async def save_subscription_endpoint(request: SubscriptionRequest):
    """
    💾 Speichert die Push Subscription eines Users.
    Das Frontend sendet hier seine Subscription nach der Registrierung.
    """
    try:
        success = handle_subscription_save(request.user_id, request.subscription)
        if success:
            return {"status": "success", "message": "Subscription saved successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to save subscription")
    except Exception as e:
        logging.error(f"❌ Error saving subscription for user {request.user_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to save subscription")

@router.post("/send_notification")
async def send_notification_endpoint(request: NotificationRequest):
    """
    🚀 Sendet eine Push Notification an einen User.
    Das ist der Hauptendpoint für das Senden von Notifications.
    """
    try:
        success = send_notification(
            user_id=request.user_id,
            title=request.title,
            body=request.body,
            icon=request.icon,
            badge=request.badge,
            image=request.image,
            tag=request.tag,
            require_interaction=request.require_interaction,
            silent=request.silent,
            vibrate=request.vibrate,
            actions=request.actions,
            data=request.data,
            url=request.url
        )
        
        if success:
            return {"status": "success", "message": "Notification sent successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to send notification")
    except Exception as e:
        logging.error(f"❌ Error sending notification to user {request.user_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to send notification")

# ============================================================================
# 🎯 VORFERTIGE NOTIFICATION ENDPOINTS
# ============================================================================

class LeadNotificationRequest(BaseModel):
    user_id: str
    lead_name: str
    email_id: str

class AppointmentNotificationRequest(BaseModel):
    user_id: str
    appointment_details: str
    email_id: str

class ReminderNotificationRequest(BaseModel):
    user_id: str
    reminder_text: str
    data: Optional[Dict[str, Any]] = None

@router.post("/send_lead_notification")
async def send_lead_notification_endpoint(request: LeadNotificationRequest):
    """
    🔥 Sendet eine Lead Notification.
    Verwendung: POST /send_lead_notification
    Body: {"user_id": "user123", "lead_name": "Max Mustermann", "email_id": "12345"}
    """
    try:
        from serviceWorker import send_lead_notification
        success = send_lead_notification(request.user_id, request.lead_name, request.email_id)
        
        if success:
            return {"status": "success", "message": "Lead notification sent successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to send lead notification")
    except Exception as e:
        logging.error(f"❌ Error sending lead notification to user {request.user_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to send lead notification")

@router.post("/send_appointment_notification")
async def send_appointment_notification_endpoint(request: AppointmentNotificationRequest):
    """
    📅 Sendet eine Appointment Notification.
    Verwendung: POST /send_appointment_notification
    Body: {"user_id": "user123", "appointment_details": "Termin um 14:00", "email_id": "12345"}
    """
    try:
        from serviceWorker import send_appointment_notification
        success = send_appointment_notification(request.user_id, request.appointment_details, request.email_id)
        
        if success:
            return {"status": "success", "message": "Appointment notification sent successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to send appointment notification")
    except Exception as e:
        logging.error(f"❌ Error sending appointment notification to user {request.user_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to send appointment notification")

@router.post("/send_reminder_notification")
async def send_reminder_notification_endpoint(request: ReminderNotificationRequest):
    """
    ⏰ Sendet eine Reminder Notification.
    Verwendung: POST /send_reminder_notification
    Body: {"user_id": "user123", "reminder_text": "Vergiss nicht deine Emails zu checken"}
    """
    try:
        from serviceWorker import send_reminder_notification
        success = send_reminder_notification(request.user_id, request.reminder_text, request.data)
        
        if success:
            return {"status": "success", "message": "Reminder notification sent successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to send reminder notification")
    except Exception as e:
        logging.error(f"❌ Error sending reminder notification to user {request.user_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to send reminder notification")

# ============================================================================
# 📚 USAGE EXAMPLES
# ============================================================================

"""
🎯 VERWENDUNGSBEISPIELE
=======================

1. VAPID Public Key holen:
   GET /vapid-public-key

2. User Subscription speichern:
   POST /save_subscription
   Body: {
     "user_id": "user123",
     "subscription": {
       "endpoint": "https://fcm.googleapis.com/fcm/send/...",
       "keys": {"p256dh": "...", "auth": "..."}
     }
   }

3. Einfache Notification senden:
   POST /send_notification
   Body: {
     "user_id": "user123",
     "title": "🔥 Neuer Lead!",
     "body": "Max Mustermann hat dir geschrieben"
   }

4. Lead Notification senden:
   POST /send_lead_notification
   Body: {
     "user_id": "user123",
     "lead_name": "Max Mustermann",
     "email_id": "12345"
   }

5. Erweiterte Notification senden:
   POST /send_notification
   Body: {
     "user_id": "user123",
     "title": "🔥 Neuer Lead!",
     "body": "Max Mustermann hat dir geschrieben",
     "icon": "/custom-icon.png",
     "require_interaction": true,
     "data": {"email_id": "12345", "type": "lead"}
   }
"""
