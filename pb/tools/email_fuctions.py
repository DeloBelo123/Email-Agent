
from email.header import decode_header
from email.message import EmailMessage
import html2text
import re
import httpx
import base64
from agent_modules.my_debbuger import *
import base64
import re
from email.header import decode_header
import httpx
import os
from agent_modules.my_supabase import *  
from supabase_tables import mail_tabelle 
from agent_modules.http_client import client

class User(BaseModel):
    id:str
    email:str
class AccessObjekt(BaseModel):
    google_refresh_token:Optional[str] = None
    google_access_token:str
    user:User
    
def get_mail_ids(access_object:AccessObjekt,max_results=17):
    google_access_token = access_object.google_access_token
    google_refresh_token = access_object.google_refresh_token
    
    headers = {"Authorization": f"Bearer {google_access_token}"}
    max_mails = {"maxResults": max_results}
    response = httpx.get(
        url="https://gmail.googleapis.com/gmail/v1/users/me/messages",
        headers=headers,
        params=max_mails
    )
    if response.status_code == 401:
        google_OAuth_respo = httpx.post(
            url="https://oauth2.googleapis.com/token",
            data={
                "client_id": os.getenv("OAUTH_CLIENT_ID"),
                "client_secret": os.getenv("OAUTH_CLIENT_KEY"),
                "refresh_token":google_refresh_token,
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
        json_response = response.json()
        mail_ids = [mail_id["id"] for mail_id in json_response["messages"]]
        return mail_ids
    json_response = response.json()
    mail_ids = [mail_id["id"] for mail_id in json_response["messages"]]
    return mail_ids

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

    def extract_text_from_parts(parts):
        texts = []
        for part in parts:
            mime_type = part.get("mimeType", "")
            body = part.get("body", {})
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

    
def create_mail_as_bytes(from_,to,subject,content) -> str:  
    try:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = from_
        msg["To"] = to
        msg.set_content(content)
        raw_message = base64.urlsafe_b64encode(msg.as_bytes()).decode("utf-8")
    except Exception as e:
        print("Error: ", e)
        return e
    return raw_message   

def send_mail(access_objekt:Type[AccessObjekt],from_,to,subject,content):
    raw_mail = create_mail_as_bytes(from_,to,subject,content)
    access_token = access_objekt.google_access_token
    respo = client.post(
        url="https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        apikey=access_token,
        body={"raw":raw_mail}
    )
    print(f"respo der 'send_mail' function: {respo}")
    
    


'''
def read_mails_OG(tokens:dict,max_results=17):
    google_token = tokens.get("google_access_token")
    
        utlity function die wir gleich brauchen werden: 
    
    # gibt dir zu jeder email-id die gesammte email zurück, also den header und den body
    def get_gmail_message_details(access_token, message_id):
        headers = {"Authorization": f"Bearer {access_token}"}
        url = f"https://gmail.googleapis.com/gmail/v1/users/me/messages/{message_id}"
        response = httpx.get(url, headers=headers)
        if not response.is_success:
            raise Exception(f"Fehler beim Auslesen der E-Mails: {response.text}")
        return response.json()
    
    #der Inhalt ist in einer Form die wir nicht auslesen können, wir müssen die vorher decoden
    def decode_mail_body(data):
        missing_padding = len(data) % 4
        if missing_padding:
            data += '=' * (4 - missing_padding)
        decoded_bytes = base64.urlsafe_b64decode(data)
        return decoded_bytes.decode("utf-8", errors="ignore")
    
    # ein regex filter der alles was nach 'http' (also https auch und somit alle links) kommt entfernt
    def remove_links_and_after(text):
        pattern = re.compile(r"http.*", re.DOTALL | re.IGNORECASE)
        cleaned_text = pattern.sub("", text)
        return cleaned_text.strip()
    
        
     die eigentliche Prozedur zum Auslesen der Mails 
    
    if not google_token:
        raise Exception("Kein Google Access Token vorhanden. Bitte Authentifizieren.")
    
    headers = {"Authorization": f"Bearer {google_token}"}
    max_mails = {"maxResults": max_results}
    response = httpx.get(
        url="https://gmail.googleapis.com/gmail/v1/users/me/messages",
        headers=headers,
        params=max_mails
    )
    if not response.is_success:
        raise Exception(f"Fehler beim Abrufen der E-Mails: {response.text}")
        
    emails = []
    email_ids_dict = response.json()["messages"] if "messages" in response.json() else [] # holt aus respone welches immer ein dict von messages (array) und status ist messages raus, in messages haben wir ein array von dicts welches eine id haben die wir am ende der gmail-api dran packen können umd die ganze email zu fetchen
    email_ids = [email_id_dict["id"] for email_id_dict in email_ids_dict]
    
    for email_id in email_ids:  
        
        email_inhalt = get_gmail_message_details(google_token, email_id) # sehr verschachteltes objekt, falls das verwirrend aussieht guck was in email_inhalt ist
        
        # Header auslesen
        headers_list = email_inhalt["payload"].get("headers", [])
        from_ = next((h["value"] for h in headers_list if h["name"].lower() == "from"), "Unbekannter From")
        subject = next((h["value"] for h in headers_list if h["name"].lower() == "subject"), "Unbekannter Subject")
        to = next((h["value"] for h in headers_list if h["name"].lower() == "to"), "Unbekannter To")
        date = next((h["value"] for h in headers_list if h["name"].lower() == "date"), "Unbekannter Date")
        
        #Body auslesen
        #wir decoden jetzt den inhalt des mails, für jeden part der Mail wenn die mail multipart ist
        raw_parts = email_inhalt["payload"]["parts"]
        if "parts" in email_inhalt["payload"]:
            #diese mail bodys sind zwar decoded, aber noch nicht von links gefiltert
            unfiltered_mail_bodys = [decode_mail_body(raw_part["body"]["data"]) for raw_part in raw_parts]
            unfiltered_text_bodys = [decode_mail_body(raw_part["body"]["data"]) for raw_part in raw_parts if raw_part["mimeType"] == "text/plain"]
            unfiltered_html_bodys = [decode_mail_body(raw_part["body"]["data"]) for raw_part in raw_parts if raw_part["mimeType"] == "text/html"]
                
            #die gefilterten bodys, also ohne Links
            filtered_mail_bodys = [remove_links_and_after(body) for body in unfiltered_mail_bodys]
            filtered_text_bodys = [remove_links_and_after(body) for body in unfiltered_text_bodys]
            filtered_html_bodys = [remove_links_and_after(body) for body in unfiltered_html_bodys]
                
            emails.append({
                "email_nr": email_id,
                "content": {
                    "Header": {
                        "Von": from_,
                        "Betreff": subject,
                        "Datum": date,
                        "An": to
                    },
                    "Body": {
                        "filtered_mail_bodys": filtered_mail_bodys,
                    }
                }
            })
        else:
            # Kein multipart, Body direkt decodieren
            body_data = email_inhalt["payload"]["body"].get("data")
            if body_data:
                decoded = decode_mail_body(body_data)
                filtered = remove_links_and_after(decoded)
                emails.append({
                "email_nr": email_id,
                "content": {
                    "Header": {
                        "Von": from_,
                        "Betreff": subject,
                        "Datum": date,
                        "An": to
                    },
                    "Body": {
                        "filtered_mail_bodys": filtered
                    }
                }
            })
            else:
                emails.append({"mimeType": "unknown", "text": ""})
        
    return emails
            





#das ist der alte von mir
def read_mails_DASALTE(user_mail:str,password:str,server:str="imap.gmail.com"):
    #initialisieren
    IMAP_SERVER = server 
    EMAIL_USER = user_mail
    EMAIL_PASS = password
    
    #mit dem server für die mail verbinden
    imap = imaplib.IMAP4_SSL(IMAP_SERVER)
    imap.login(EMAIL_USER, EMAIL_PASS)
    imap.select("inbox")

    #die email ids bekommen um die im nächsten schritt auszulesen
    status, messages = imap.search(None, "ALL")
    if status != "OK":
        raise Exception("Fehler beim Suchen der Nachrichten")  
    mail_ids = messages[0].split()
    
    # der link ausfilterer
    def remove_links_and_after(text):
        # Suche nach dem ersten "http" (groß-/kleinschreibung ignoriert)
        # und schneidet ab dort alles weg
        pattern = re.compile(r"http.*", re.DOTALL | re.IGNORECASE)
        cleaned_text = pattern.sub("", text)
        return cleaned_text.strip()
    #die emails auslesen
    mail_liste = []
    for mail_id in mail_ids[-10:]: 
        #der rohe email inhalt (alles ausser lesbarer text)
        if isinstance(mail_id, bytes):
            mail_id = mail_id.decode()
        print(f"der Typ von mail_id:{type(mail_id)}")
        status, data = imap.fetch(mail_id, "(RFC822)")
        raw_email = data[0][1]
        
        # Email-Objekt parsen
        msg = email.message_from_bytes(raw_email)

        # --- Header auslesen ---
        subject, encoding = decode_header(msg["Subject"])[0]
        if isinstance(subject, bytes):
            subject = subject.decode(encoding or "utf-8")
        from_ = msg.get("From")
        print(f"\n=== Neue E-Mail ===")
        print("Von:", from_)
        print("Betreff:", subject)

        # --- Inhalt auslesen ---
        if msg.is_multipart():
            for part in msg.walk():
                content_type = part.get_content_type()
                content_disposition = str(part.get("Content-Disposition"))
                if "attachment" not in content_disposition and content_type == "text/plain":
                    body = part.get_payload(decode=True).decode(errors="ignore").strip()
                    linkless_body = remove_links_and_after(body)
                    print("Inhalt:\n", linkless_body)
                    break
                elif "attachment" not in content_disposition and content_type == "text/html":
                    html_body = part.get_payload(decode=True).decode(errors="ignore").strip()
                    html_text = html2text.html2text(html_body)
                    linkless_body = remove_links_and_after(html_text)
                    print("Inhalt(HTML):\n", linkless_body)
                    break
        else:
            body = msg.get_payload(decode=True).decode(errors="ignore").strip()
            linkless_body = remove_links_and_after(body)
            print("Inhalt:\n", linkless_body)
            
        mail_inhalt = {
            "Header":
                {"Von":from_,"Betreff":subject},
            "Body":linkless_body}
        mail_liste.append({"email_nr": str(mail_id), "content": mail_inhalt})
            
    imap.logout()
    return mail_liste

# SECURITY FIX: Removed hardcoded credentials
# my_mails = read_mails(user_mail="faragdelo@gmail.com",password="hfybwdyxkvypimrd")
# print(my_mails)
'''