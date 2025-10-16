"""
🚀 EINFACHE PUSH NOTIFICATION API für deine Email-Agent SaaS
================================================================

Diese Datei bietet dir eine super einfache API für Push Notifications.
Du musst nur eine Funktion aufrufen und alles funktioniert automatisch!

VERWENDUNG:
-----------
from serviceWorker import send_notification

# Einfachste Verwendung
send_notification(
    user_id="user123",
    title="🔥 Neuer Lead!",
    body="Max Mustermann hat dir geschrieben"
)

# Erweiterte Verwendung
send_notification(
    user_id="user123",
    title="🔥 Neuer Lead!",
    body="Max Mustermann hat dir geschrieben",
    icon="/custom-icon.png",
    data={"email_id": "12345", "type": "lead"},
    require_interaction=True
)
"""

import json
import os
import logging
from typing import Dict, Any, Optional, List
from pywebpush import webpush, WebPushException
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat, PrivateFormat, NoEncryption
from cryptography.hazmat.backends import default_backend
import base64

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# ============================================================================
# 🔑 VAPID KEY MANAGEMENT
# ============================================================================

def generate_vapid_keys():
    """Generates VAPID private and public keys."""
    private_key = ec.generate_private_key(
        ec.SECP256R1(), default_backend()
    )
    public_key = private_key.public_key()

    # Serialize keys to PEM format
    private_pem = private_key.private_bytes(
        Encoding.PEM, PrivateFormat.PKCS8, NoEncryption()
    ).decode('utf-8')

    public_pem = public_key.public_bytes(
        Encoding.PEM, PublicFormat.SubjectPublicKeyInfo
    ).decode('utf-8')
    
    # Convert public key to URL-safe base64 for frontend
    public_key_bytes = public_key.public_bytes(
        Encoding.X962, PublicFormat.UncompressedPoint
    )[1:] # Remove the 0x04 prefix
    public_key_base64 = base64.urlsafe_b64encode(public_key_bytes).decode('utf-8').rstrip('=')

    logging.info("🔑 VAPID Keys generated:")
    logging.info(f"Private Key (PEM):\n{private_pem}")
    logging.info(f"Public Key (PEM):\n{public_pem}")
    logging.info(f"Public Key (Base64 for Frontend): {public_key_base64}")
    
    return private_pem, public_key_base64

# Load VAPID keys from environment variables
VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY")
VAPID_PUBLIC_KEY = os.getenv("VAPID_PUBLIC_KEY")
VAPID_CLAIMS = {"sub": "mailto:your-email@example.com"} # Replace with your actual email

if not VAPID_PRIVATE_KEY or not VAPID_PUBLIC_KEY:
    logging.warning("⚠️ VAPID_PRIVATE_KEY or VAPID_PUBLIC_KEY not found in environment variables. Generating new keys.")
    VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY = generate_vapid_keys()
    logging.info("💾 Please save these keys to your environment variables!")

# ============================================================================
# 🗄️ SUBSCRIPTION STORAGE (In-Memory für Demo - in Production: Database)
# ============================================================================

# In Production: Use your database instead!
user_subscriptions = {}

def save_subscription(user_id: str, subscription_info: dict):
    """Saves user subscription to storage."""
    user_subscriptions[user_id] = subscription_info
    logging.info(f"💾 Subscription saved for user: {user_id}")

def get_subscription(user_id: str) -> Optional[dict]:
    """Gets user subscription from storage."""
    return user_subscriptions.get(user_id)

# ============================================================================
# 🚀 HAUPTFUNKTION - DIE EINZIGE DIE DU BRAUCHST!
# ============================================================================

def send_notification(
    user_id: str,
    title: str,
    body: str,
    icon: str = "/icon-192x192.png",
    badge: str = "/badge-72x72.png",
    image: Optional[str] = None,
    tag: Optional[str] = None,
    require_interaction: bool = False,
    silent: bool = False,
    vibrate: Optional[List[int]] = None,
    actions: Optional[List[Dict[str, str]]] = None,
    data: Optional[Dict[str, Any]] = None,
    url: str = "/readMails"
) -> bool:
    """
    🎯 EINFACHSTE PUSH NOTIFICATION FUNKTION!
    
    Args:
        user_id (str): ID des Users (z.B. aus Supabase Auth)
        title (str): Titel der Notification
        body (str): Text der Notification
        icon (str): Icon URL (default: "/icon-192x192.png")
        badge (str): Badge URL (default: "/badge-72x72.png")
        image (str, optional): Großes Bild URL
        tag (str, optional): Eindeutige ID (ersetzt alte Notifications)
        require_interaction (bool): Bleibt bis User interagiert (default: False)
        silent (bool): Mit/ohne Sound (default: False)
        vibrate (List[int], optional): Vibrationsmuster [200, 100, 200]
        actions (List[Dict], optional): Aktionen [{"action": "open", "title": "Öffnen"}]
        data (Dict, optional): Zusätzliche Daten
        url (str): URL die geöffnet wird (default: "/readMails")
    
    Returns:
        bool: True wenn erfolgreich, False wenn Fehler
    
    Examples:
        # Einfachste Verwendung
        send_notification("user123", "🔥 Neuer Lead!", "Max Mustermann hat dir geschrieben")
        
        # Erweiterte Verwendung
        send_notification(
            user_id="user123",
            title="🔥 Neuer Lead!",
            body="Max Mustermann hat dir geschrieben",
            icon="/custom-icon.png",
            data={"email_id": "12345", "type": "lead"},
            require_interaction=True
        )
    """
    try:
        # 1. User Subscription holen
        subscription_info = get_subscription(user_id)
        if not subscription_info:
            logging.warning(f"⚠️ No subscription found for user: {user_id}")
            return False
        
        # 2. Notification Payload erstellen
        payload = {
            "title": title,
            "body": body,
            "icon": icon,
            "badge": badge,
            "tag": tag,
            "requireInteraction": require_interaction,
            "silent": silent,
            "data": {
                "url": url,
                **(data or {})
            }
        }
        
        # 3. Optionale Properties hinzufügen
        if image:
            payload["image"] = image
        if vibrate:
            payload["vibrate"] = vibrate
        if actions:
            payload["actions"] = actions
        
        # 4. Push Notification senden
        webpush(
            subscription_info=subscription_info,
            data=json.dumps(payload),
            vapid_private_key=VAPID_PRIVATE_KEY,
            vapid_claims=VAPID_CLAIMS
        )
        
        logging.info(f"✅ Push notification sent to user: {user_id}")
        return True
        
    except WebPushException as e:
        logging.error(f"❌ Push notification failed for user {user_id}: {e}")
        return False
    except Exception as e:
        logging.error(f"❌ Unexpected error sending push notification to user {user_id}: {e}")
        return False

# ============================================================================
# 🎯 VORFERTIGE NOTIFICATION FUNKTIONEN
# ============================================================================

def send_lead_notification(user_id: str, lead_name: str, email_id: str, url:str, ) -> bool:
    """Sends a push notification for a new lead."""
    return send_notification(
        user_id=user_id,
        title="potenzieller Lead!",
        body=f"{lead_name} hat dir geschrieben",
        icon="/icon-192x192.png", # muss hier noch passende icon finden
        badge="/badge-72x72.png", # muss hier noch passende icon finden
        tag=f"lead-{email_id}",
        require_interaction=True,
        data={"email_id": email_id, "type": "lead"},
        url=url
    )

def send_appointment_notification(user_id: str, appointment_details: str, email_id: str) -> bool:
    """Sends a push notification for a new appointment."""
    return send_notification(
        user_id=user_id,
        title="📅 Neuer Termin!",
        body=f"Ein Termin wurde für {appointment_details} erstellt",
        icon="/icon-192x192.png",
        badge="/badge-72x72.png",
        tag=f"appointment-{email_id}",
        require_interaction=True,
        data={"email_id": email_id, "type": "appointment"},
        url="/readMails"
    )

def send_reminder_notification(user_id: str, reminder_text: str, data: Optional[Dict] = None) -> bool:
    """Sends a generic reminder push notification."""
    return send_notification(
        user_id=user_id,
        title="⏰ Erinnerung!",
        body=reminder_text,
        icon="/icon-192x192.png",
        badge="/badge-72x72.png",
        tag="reminder",
        data=data or {"type": "reminder"},
        url="/readMails"
    )

# ============================================================================
# 🔧 BACKEND ENDPOINT FUNCTIONS
# ============================================================================

def handle_subscription_save(user_id: str, subscription_info: dict) -> bool:
    """Handles saving user subscription (for FastAPI endpoint)."""
    try:
        save_subscription(user_id, subscription_info)
        return True
    except Exception as e:
        logging.error(f"❌ Error saving subscription for user {user_id}: {e}")
        return False

def get_vapid_public_key() -> str:
    """Returns VAPID public key for frontend."""
    return VAPID_PUBLIC_KEY

# ============================================================================
# 📚 VOLLSTÄNDIGE NOTIFICATION OPTIONS DOKUMENTATION
# ============================================================================

"""
🎯 VOLLSTÄNDIGE NOTIFICATION OPTIONS DOKUMENTATION
==================================================

Alle verfügbaren Properties für Push Notifications:

GRUNDLEGENDE EIGENSCHAFTEN:
- title (str): Titel der Notification
- body (str): Haupttext der Notification
- icon (str): Icon URL (192x192px empfohlen)
- badge (str): Badge URL (72x72px empfohlen)
- image (str): Großes Bild URL (optional)

VERHALTEN:
- tag (str): Eindeutige ID (ersetzt alte Notifications mit gleichem Tag)
- requireInteraction (bool): Bleibt bis User interagiert (default: False)
- silent (bool): Mit/ohne Sound (default: False)
- vibrate (List[int]): Vibrationsmuster für Mobile [200, 100, 200]

AKTIONEN:
- actions (List[Dict]): Liste von Aktionen
  [
    {"action": "open", "title": "Öffnen", "icon": "/open-icon.png"},
    {"action": "close", "title": "Schließen", "icon": "/close-icon.png"}
  ]

DATEN:
- data (Dict): Zusätzliche Daten die mit der Notification gespeichert werden
  {"email_id": "12345", "type": "lead", "url": "/readMails"}

BEISPIEL FÜR VOLLSTÄNDIGE NOTIFICATION:
======================================
send_notification(
    user_id="user123",
    title="🔥 Neuer Lead!",
    body="Max Mustermann hat dir geschrieben",
    icon="/icon-192x192.png",
    badge="/badge-72x72.png",
    image="/lead-image.png",
    tag="lead-12345",
    require_interaction=True,
    silent=False,
    vibrate=[200, 100, 200],
    actions=[
        {"action": "open", "title": "Öffnen", "icon": "/open-icon.png"},
        {"action": "close", "title": "Schließen", "icon": "/close-icon.png"}
    ],
    data={"email_id": "12345", "type": "lead"},
    url="/readMails"
)
"""

# ============================================================================
# 🚀 VAPID KEY GENERATION (Run this file to generate keys)
# ============================================================================

if __name__ == "__main__":
    logging.info("🔑 Generating VAPID keys...")
    private_key, public_key = generate_vapid_keys()
    
    print("\n" + "="*60)
    print("🔑 VAPID KEYS GENERIERT!")
    print("="*60)
    print(f"Private Key: {private_key[:50]}...")
    print(f"Public Key: {public_key}")
    print("\n💾 Setze diese Environment Variables:")
    print(f"export VAPID_PRIVATE_KEY='{private_key}'")
    print(f"export VAPID_PUBLIC_KEY='{public_key}'")
    print("="*60)