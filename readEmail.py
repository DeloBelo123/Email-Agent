
from pb.agent_modules.my_agents import *
from pb.agent_modules.langchain_imports import *
from pb.agent_modules.fastapi_config import *
from pb.tools.file_functions import add_to_file
from pb.supabase_tables import mail_tabelle,user_tabelle
from dataModels import AccessObjekt, OutPutSchema, SubscriptionTier
from projektAgents import termin_planer,email_writer
from celery import Celery
from redis import Redis

from serviceWorker import send_lead_notification

router = APIRouter()
redis = Redis(host='localhost', port=6379, db=0) #WICHTIG: merk dir korrekte server konfig damit über restarts hinweg data bleibt
celery = Celery("email_tasks",broker="redis://localhost:6379/0",backend="redis://localhost:6379/0")

celery.conf.beat_schedule = {
    'process-emails-every-20-minutes': {
        'task': 'readEmail.process_offline_users',
        'schedule': 1200,
        'args':()
    },
}

on_office_key = os.getenv("ON_OFFICE_API_KEY")
on_office_secret = os.getenv("ON_OFFICE_SECRET_KEY")

@output_structured_by_architect(OutPutSchema)
def read_google_mails(access_object:AccessObjekt,newest_mail_ids_to_readout:list[str], max_results:int=17):

    def get_gmail_message_details(access_token,refresh_token, message_id):
        headers = {"Authorization": f"Bearer {access_token}"}
        response = httpx.get(
            url=f"https://gmail.googleapis.com/gmail/v1/users/me/messages/{message_id}",
            headers=headers
        )
        if response.status_code == 401:
            google_OAuth_respo = httpx.post(
            url="https://oauth2.googleapis.com/token",  
            data={
                "client_id": os.getenv("OAUTH_CLIENT_ID"),
                "client_secret": os.getenv("OAUTH_CLIENT_KEY"),
                "refresh_token":refresh_token,
                "grant_type": "refresh_token"
            })
            fresh_google_access_token = google_OAuth_respo.json()["access_token"]
            headers = {"Authorization": f"Bearer {fresh_google_access_token}"}
            max_mails = {"maxResults": max_results}
            response = httpx.get(
                url="https://gmail.googleapis.com/gmail/v1/users/me/messages",
                headers=headers,
                params=max_mails
            )
            if not response.is_success:
                raise ValueError("keine mails bekommen nach freshem access_token")
            return response.json()
        return response.json()

    def decode_mail_body(data):
        try:
            missing_padding = len(data) % 4
            if missing_padding:
                data += '=' * (4 - missing_padding)
            decoded_bytes = base64.urlsafe_b64decode(data)
            return decoded_bytes.decode("utf-8", errors="ignore")
        except Exception as e:
            print(f"Fehler beim Decodieren des Mailbodys: {e}")
            return ""

    def remove_links_and_after(text):
        pattern = re.compile(r"http.*", re.DOTALL | re.IGNORECASE)
        cleaned_text = pattern.sub("", text)
        return cleaned_text.strip()

    def extract_text_from_parts(parts:List[dict]):
        texts = []
        for part in parts:
            mime_type = part.get("mimeType", "")
            body:dict = part.get("body", {})
            data = body.get("data")

            if "parts" in part:
                texts.extend(extract_text_from_parts(part["parts"]))
            elif data and mime_type in ["text/plain", "text/html"]:
                decoded = decode_mail_body(data)
                # Wenn HTML, konvertiere zu lesbarem Text
                if mime_type == "text/html":
                    decoded = html2text.html2text(decoded)
                texts.append(decoded)
        return texts
    
    def decode_mime_header(header_value):
        decoded_fragments = decode_header(header_value)
        decoded_string = ""
        for fragment, encoding in decoded_fragments:
            if isinstance(fragment, bytes):
                decoded_string += fragment.decode(encoding or "utf-8", errors="ignore")
            else:
                decoded_string += fragment
        return decoded_string
    
    # jetzt wird wirklich angefangen, das davor war einfach nur vorbereitung
    google_token = access_object.google_access_token
    google_refresh_token = access_object.google_refresh_token
    user = access_object.user
    logging.warning(f"{BOLD}das hier ist der user: {user} und seine id: {user.id}")
    print(f"Google Access Token: {google_token}")

    if not google_token:
        raise Exception("Kein Google Access Token vorhanden. Bitte Authentifizieren.")

    emails = []

    for email_id in newest_mail_ids_to_readout[-18:]:
        email_inhalt = get_gmail_message_details(google_token,google_refresh_token, email_id)
        print(f"def Rohe Email Inhalt: {email_inhalt}")

        headers_list = email_inhalt["payload"].get("headers", [])
        from_ = next((decode_mime_header(h["value"]) for h in headers_list if h["name"].lower() == "from"), "Unbekannter From")
        subject = next((decode_mime_header(h["value"]) for h in headers_list if h["name"].lower() == "subject"), "Unbekannter Subject")
        to = next((decode_mime_header(h["value"]) for h in headers_list if h["name"].lower() == "to"), "Unbekannter To")
        date = next((decode_mime_header(h["value"]) for h in headers_list if h["name"].lower() == "date"), "Unbekannter Date")
        
        if "parts" in email_inhalt["payload"]:
            raw_parts = email_inhalt["payload"]["parts"]
            decoded_texts = extract_text_from_parts(raw_parts)
            filtered_texts = [remove_links_and_after(t) for t in decoded_texts]
        else:
            body_data = email_inhalt["payload"]["body"].get("data")
            if body_data:
                decoded = decode_mail_body(body_data)
                mime_type = email_inhalt["payload"].get("mimeType", "")
                if mime_type == "text/html":
                    decoded = html2text.html2text(decoded)
                filtered_texts = [remove_links_and_after(decoded)]
            else:
                filtered_texts = []
                
        #direkt schon in die tabelle speichern
        mail_tabelle.upsert(
            rows=[{"unique_mail_id":email_id, "inhaber_id":user.id, "mail_body":" ".join(filtered_texts),"mail_header":{"from_":from_,"subject":subject,"date":date}}],
            on_conflict="unique_mail_id"
        )
        emails.append({
            "email_owner_id": user.id,
            "email_id": email_id,
            "content": {
                "Header": {
                    "Von": from_,
                    "Betreff": subject,
                    "Datum": date,
                    "An": to
                },
                "Body": {
                    "filtered_texts": filtered_texts,
                }
            }
        })
    return emails

def get_mail_ids(access_object: AccessObjekt, max_results: int = 20) -> list[str]:
    google_token = access_object.google_access_token
    google_refresh_token = access_object.google_refresh_token
    
    if not google_token:
        raise Exception("Kein Google Access Token vorhanden")
    
    headers = {"Authorization": f"Bearer {google_token}"}
    
    try:
        # Gmail API aufrufen um Mail-IDs zu bekommen
        response = httpx.get(
            url="https://gmail.googleapis.com/gmail/v1/users/me/messages",
            headers=headers,
            params={"maxResults": max_results}
        )
        
        if response.status_code == 401:
            # Token ist abgelaufen, versuche Refresh
            if google_refresh_token:
                refresh_response = httpx.post(
                    url="https://oauth2.googleapis.com/token",
                    data={
                        "client_id": os.getenv("OAUTH_CLIENT_ID"),
                        "client_secret": os.getenv("OAUTH_CLIENT_KEY"),
                        "refresh_token": google_refresh_token,
                        "grant_type": "refresh_token"
                    }
                )
                if refresh_response.is_success:
                    fresh_token = refresh_response.json()["access_token"]
                    headers = {"Authorization": f"Bearer {fresh_token}"}
                    response = httpx.get(
                        url="https://gmail.googleapis.com/gmail/v1/users/me/messages",
                        headers=headers,
                        params={"maxResults": max_results}
                    )
        
        if not response.is_success:
            raise Exception(f"Gmail API Fehler: {response.status_code} - {response.text}")
        
        data = response.json()
        mail_ids = [message["id"] for message in data.get("messages", [])]
        logging.warning(f"Gefundene Mail-IDs: {len(mail_ids)}")
        return mail_ids
        
    except Exception as e:
        logging.error(f"Fehler beim Abrufen der Mail-IDs: {e}")
        return []

@celery.task  
def AI_mail_updating(tokens: AccessObjekt):
    mail_tabelle_ids = mail_tabelle.select(columns=["unique_mail_id"])
    real_mail_tabelle_ids = [row["unique_mail_id"] for row in mail_tabelle_ids]
    all_mail_ids = get_mail_ids(tokens,max_results=18)
    newest_mail_ids = list(set(all_mail_ids) - set(real_mail_tabelle_ids))  
    logging.warning(f"die neusten mail ids: {newest_mail_ids}")
    logging.error(tokens)
    
    premium_users = mail_tabelle.select(
        columns=["user_id"],
        where=[{"column":"Abo","is_":SubscriptionTier.PREMIUM.value}]
    )
    premium_users_id = [user["user_id"] for user in premium_users]
    try:
        sorted_emails = read_google_mails(
            access_object=tokens,
            newest_mail_ids_to_readout= newest_mail_ids
        )
        
        # Update database with categorized emails
        if hasattr(sorted_emails, 'model_dump'):
            for categorie_name,categorie_list in sorted_emails.model_dump().items():
                for email in categorie_list:
                    try:
                        mail_tabelle.update(
                            update={"mail_summary":email["summary"],"mail_category":email["mail_category"]},
                            where=[{"column":"unique_mail_id","is_":email["email_id"]}]
                        )
                        # update onOffice calendar if email contains appointment
                        if on_office_key and email["mail_category"] != "spam_unwichtiges" and email["contains_appointment"]:
                            termin_mail_body_result = mail_tabelle.select(
                                columns=["mail_body"],
                                where=[{"column":"unique_mail_id","is_":email["email_id"]}]
                            )
                            if termin_mail_body_result:
                                termin_mail_body = termin_mail_body_result[0]["mail_body"]
                            else:
                                logging.error(f"(from termin) No mail body found for email id: {email['email_id']}")
                            done_status = termin_planer.invoke({
                                "content":termin_mail_body,
                                "from_":email["mail_header"]["from_"],
                                "subject":email["mail_header"]["subject"]
                            })
                            if not done_status:
                                raise OneCallAgentError("Error! Terminplaner hat die aufgabe aus irgendeinem Grund nicht erledigt, Debuge für nähere info bro")
                        
                        if email["email_owner_id"] in premium_users_id and email["mail_category"] == "neue_interessenten":
                            send = send_lead_notification(
                                user_id=email["email_owner_id"],
                                lead_name=email["mail_header"]["from_"],
                                email_id=email["email_id"],
                                url="https://localhost:3000/readMails" # ist eig nur dummy data
                            )
                            if not send:
                                raise Exception("Ein Error beim push-notification senden, Pushnotification konnte nicht gesendet werden")
                            
                            # Online-Status checken
                            OnOff_arr = user_tabelle.select(
                                columns=["OnOff"],
                                where=[{"column":"user_id","is_":email["email_owner_id"]}]
                            )
                            user_onoff_status = OnOff_arr[0]["OnOff"] if OnOff_arr and len(OnOff_arr) > 0 else "off"
                            
                            if user_onoff_status == "on":
                                logging.info(f"User {email['email_owner_id']} ONLINE - skip Auto-Response")
                                continue
                            
                            important_mail_body_result = mail_tabelle.select(
                                columns=["mail_body"],
                                where=[{"column":"unique_mail_id","is_":email["email_id"]}]
                            )
                            if important_mail_body_result:
                                important_mail_body = important_mail_body_result[0]["mail_body"]
                                add_to_file("offlineLogs.txt",f"-mail body from offline reading: {important_mail_body}")
                            else:
                                logging.error(f"(from auto-respo) No mail body found for email id: {email['email_id']}")
                                continue
                            
                            if user_onoff_status == "on":
                                continue
                            else:    
                                auto_generated_email = email_writer.invoke({
                                    "input":f"generiere eine professionelle Antwort zu dieser Mail eines potenziellen Kundens:{[important_mail_body,email["mail_header"]]}"
                                })
                                add_to_file("offlineLogs.txt",f"generated Email (from AI-mail-updating): {auto_generated_email}")
                                try:
                                    response = httpx.post(
                                        url="http://localhost:8000/auto_send_email/test3",
                                        json={
                                            "google_access_token": tokens.google_access_token,
                                            "google_refresh_token": tokens.google_refresh_token,
                                            "user": tokens.user.model_dump(),
                                            "email": {
                                                "from_": auto_generated_email.from_,
                                                "to": auto_generated_email.to,
                                                "subject": auto_generated_email.subject,
                                                "content": auto_generated_email.content
                                            }
                                        }
                                    )
                                    if response.is_success:
                                        logging.info(f"Auto-response scheduled for email {email['email_id']}")
                                    else:
                                        logging.error(f"Failed to schedule auto-response: {response.status_code}")
                                except Exception as e:
                                    logging.error(f"Error scheduling auto-response: {e}")
                                
                            
                    except Exception as e:
                        logging.error(f"Error updating email id: {email['email_id']}: {e}")
                        continue
        
        print(f"sorted emails: {sorted_emails}")
        return {"status":205,"emails":sorted_emails}
        
    except Exception as e:
        logging.error(f"Error in main function: {e}")

        return {
            "status": 207,
            "emails": {
                "neue_interessenten": [],
                "bestehende_kunden": [],
                "eigentuemer_verkaufsinteressenten": [],
                "behoerdliche_rechtliche_themen": [],
                "marketing_kooperationen": [],
                "spam_unwichtiges": []
            }
        }

@celery.task
def process_offline_users():
    premium_users = mail_tabelle.select(
        columns=["user_id"],
        where=[{"column":"Abo","is_":SubscriptionTier.PREMIUM.value}]
    )
    premium_users_ids = [user["user_id"] for user in premium_users]
    for premium_user_id in premium_users_ids:
        user_tokens_json = redis.get(f"premium_user_{premium_user_id}")
        if user_tokens_json:
            user_tokens = AccessObjekt.model_validate_json(user_tokens_json)
            AI_mail_updating.delay(user_tokens)
        else:
            logging.warning(f"No tokens found for premium user id: {premium_user_id}")

@router.post("/read_emails/test3")
def get_front_ends_AccessObjekt(tokens:AccessObjekt):
    premium_users = mail_tabelle.select(
        columns=["user_id"],
        where=[{"column":"Abo","is":SubscriptionTier.PREMIUM.value}]
    )
    for premium_user in premium_users:
        if tokens.user.id == premium_user["user_id"]:
            logging.warning(f"der user {tokens.user.id} ist premium und wurde der liste hinzugefügt")
            redis.set(f"premium_user_{tokens.user.id}",tokens.model_dump_json())
    
    respo = AI_mail_updating(tokens)
    return respo
    