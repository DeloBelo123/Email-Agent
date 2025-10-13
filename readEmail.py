
from pb.agent_modules.my_agents import *
from pb.agent_modules.langchain_imports import *
from pb.agent_modules.fastapi_config import *
from pb.tools.file_functions import read_file
from pb.CRM.OnOffice.config import CalendarEntryParameters,update_calendar_tool
from pb.supabase_tables import mail_tabelle
from typing import TypedDict as TD
from celery import Celery
from redis import Redis
import crontab


class User(BaseModel):
    id:str
    email:str
class AccessObjekt(BaseModel):
    google_access_token:str
    google_refresh_token:Optional[str] = None
    user:User
    extraData:bool

router = APIRouter()
redis = Redis(host='localhost', port=6379, db=0)
celery = Celery("email_tasks",broker="redis://localhost:6379/0",backend="redis://localhost:6379/0")

on_office_key = os.getenv("ON_OFFICE_API_KEY")
on_office_secret = os.getenv("ON_OFFICE_SECRET_KEY")

class EmailHeader(BaseModel): 
    from_:str = Field(description="sagst von wem die email geschickt wurde")
    subject:str = Field(description=" sagst das thema der geschickten email (steht bei mails in der 'subject' Zeile)")
class Email(BaseModel):
    mail_header:EmailHeader = Field(description="das ist der header der Email, hier sind die daten 'from' also von wem die mail kam und 'subject', also das oberthema der mail")
    summary:str = Field(description=" eine umfangreiche aber nicht zu lange zusammenfassung der Mail, die für ein guten überblick des inhaltes sorgt")
    email_id:str = Field(description="das ist die unique ID von jeder email, du weist ja das jede mail seine eigene ID hat bei gmail")
    email_owner_id:str = Field(description="das ist die ID des besitzers der mails, also an den die mails gehen, alle mails sind sozusagen mails dieser ID")
    mail_category:str = Field(description=" hier schreibst du schreibst du auf, zu welcher kategorie die email eingeteilt hast, die kategorien müssen der in der du alle mails einteilst überein stimmen")
    contains_appointment:bool = Field(description="setze diese auf True, wenn diese Email auf eine terminanfrage oder terminbesprechung hinweist")
class OutPutSchema(BaseModel):
    neue_interessenten: List[Email] = Field(description=("Alle E-Mails mit Anfragen zu Besichtigungen, Kauf- oder Mietinteresse. Diese stammen oft von Immobilienportalen (z. B. Immobilienscout, Immonet) oder direkt von Kunden über die Website. Diese Mails müssen sofort gesehen werden und haben höchste Priorität."))
    bestehende_kunden: List[Email] = Field(description=("E-Mails von Personen, die bereits eine Immobilie besichtigt haben oder kurz vor einem Vertragsabschluss stehen. Enthalten oft wichtige Fragen, Dokumentenanforderungen und Preisverhandlungen."))
    eigentuemer_verkaufsinteressenten: List[Email] = Field(description=("E-Mails von Eigentümern oder Verkaufsinteressenten, die ihre Immobilie verkaufen oder vermieten möchten. Diese sind sehr lukrativ und müssen schnell beantwortet werden, um den Auftrag nicht an Konkurrenten zu verlieren."))
    behoerdliche_rechtliche_themen: List[Email] = Field(description=("E-Mails von Behörden, Notaren, Banken oder Versicherungen. Diese enthalten oft zeitkritische Termine, Anfragen und Dokumentenanforderungen."))
    marketing_kooperationen: List[Email] = Field(description=("Angebote und Anfragen bezüglich Marketing, Fotografen, Handwerkern, Home-Staging-Firmen und anderen Kooperationspartnern im Immobilienbereich."))
    spam_unwichtiges: List[Email] = Field(description=("Newsletter, Werbemails, Spam und andere irrelevante oder unerwünschte Nachrichten ohne Bedeutung für das Geschäft."))

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

@celery.task(autoretry_for=(Exception,), retry_backoff=True, retry_kwargs={"max_retries": 3})
def AI_mail_updating(tokens: AccessObjekt):
    
    mail_tabelle_ids = mail_tabelle.select(columns=["unique_mail_id"])
    real_mail_tabelle_ids = [row["unique_mail_id"] for row in mail_tabelle_ids]
    all_mail_ids = get_mail_ids(tokens,max_results=18)
    newest_mail_ids = list(set(all_mail_ids) - set(real_mail_tabelle_ids))  
    logging.warning(f"die neusten mail ids: {newest_mail_ids}")
    logging.error(tokens)
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
                                logging.error(f"No mail body found for email id: {email['email_id']}")
                            done_status = termin_planer.invoke({
                                "content":termin_mail_body,
                                "from_":email["mail_header"]["from_"],
                                "subject":email["mail_header"]["subject"]
                            })
                            if not done_status:
                                raise OneCallAgentError("Error! Terminplaner hat die aufgabe aus irgendeinem Grund nicht erledigt, Debuge für nähere info bro")
                            
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

class TerminInvokeSchema(TD):
    from_:str
    subject:str
    content:str
termin_planer = OneCallAgent[TerminInvokeSchema,Done](
    name="onOffice termin updater",
    description="updatet den Termin kalender des kunden anhand der Emails, yanni ob in den mails was von temrin steht",
    tools=[
        AgentTool(
            name="update_calendar_tool",
            description="Erstellt einen Termin im onOffice Kalender des Kunden",
            input_schema=CalendarEntryParameters,
            func=update_calendar_tool
        )
    ],
    output_structure=Done,
    prompt=[
        ("system", """
            Du bist ein hochspezialisierter Termin-Extraktor für Immobilienmakler. Deine Aufgabe ist es, aus E-Mails präzise Termin-Informationen zu extrahieren und diese in den onOffice-Kalender einzutragen.

            ## KRITISCHE REGELN:
            1. **NUR echte Termine extrahieren** - keine vagen Andeutungen oder "vielleicht"
            2. **Immer Datum UND Uhrzeit** - ohne beides = kein Termin
            3. **Deutsche Zeitformate** - "15.10.2025 14:30" oder "morgen um 10 Uhr"
            4. **Realistische Dauer** - Standard: 60 Minuten, Besichtigungen: 30-45 Min
            5. **Klare Ortsangaben** - Adresse, Objekt-ID oder "Büro"

            ## TERMIN-TYPEN (Immobilien):
            - **Besichtigungstermine**: "Besichtigung", "Besuch", "Rundgang"
            - **Beratungstermine**: "Beratung", "Gespräch", "Termin"
            - **Vertragsabschlüsse**: "Unterschrift", "Vertrag", "Notar"
            - **Behördentermine**: "Amt", "Behörde", "Genehmigung"

            ## ZEIT-ERKENNUNG:
            - **Explizit**: "15.10.2025 um 14:30", "morgen 10 Uhr"
            - **Relativ**: "nächste Woche Dienstag", "übermorgen"
            - **Wochentage**: "Montag um 15 Uhr" (nächster Montag)
            - **Zeiträume**: "zwischen 14-16 Uhr" → 14:00-15:00

            ## ORT-ERKENNUNG:
            - **Vollständige Adressen**: "Musterstraße 123, 12345 Berlin"
            - **Objekt-Referenzen**: "Objekt XY", "Immobilie ABC"
            - **Büro/Standort**: "unser Büro", "Standort Mitte"

            ## FALLBACK-STRATEGIEN:
            - **Unklare Zeit**: "14:00" (Standard)
            - **Unklarer Ort**: "Büro" oder "zu vereinbaren"
            - **Unklare Dauer**: "60 Minuten"

            ## QUALITÄTSKONTROLLE:
            - Prüfe JEDEN extrahierten Wert auf Plausibilität
            - Bei Unsicherheit: NICHT erstellen
            - Logge alle Entscheidungen für Debugging

            ## OUTPUT-FORMAT:
            - subject: Kurz und prägnant (max 100 Zeichen)
            - start: "YYYY-MM-DD HH:MM:SS"
            - end: "YYYY-MM-DD HH:MM:SS" (start + Dauer)
            - location: Präzise Ortsangabe
            - description: Email-Inhalt als Kontext
            - reminder: "15" (15 Minuten vorher)

            Du bist ein Experte für deutsche Immobilien-Termine. Sei präzise, konservativ und zuverlässig.
                        """),
                        ("human", """
            Analysiere diese E-Mail auf Termin-Informationen:

            E-Mail von: {from_}
            Betreff: {subject}
            Inhalt: {content}

            Extrahiere ALLE Termine und erstelle für jeden einen Kalendereintrag. Wenn kein klarer Termin erkennbar ist, erstelle KEINEN Eintrag.

            WICHTIG: Prüfe jeden extrahierten Wert auf Plausibilität und Vollständigkeit!
        """)
    ]
)
termin_planer.add_context([read_file("termin_planer_rag.txt")])

@router.post("/read_emails/test3/version3")
def get_front_ends_AccessObjekt(tokens:AccessObjekt):
    online = tokens.extraData
    user_id = tokens.user.id

    celery.conf.beat_schedule = {
    'process-emails-every-5-minutes': {
        'task': 'readEmail3.AI_mail_updating',
        'schedule': crontab(minute='*/20'),
        'args':(tokens)
    },
}
    
    if online:
        logging.info(f"user {user_id} ist online, mails werden direkt aktualisiert")
        AI_mail_updating.apply(args=[tokens]).get()
        return {"status": 210, "message": "Mails wurden direkt aktualisiert"}
    else:
        logging.info(f"user {user_id} ist offline, starte background task")
        AI_mail_updating.delay(tokens)
        return {"status": 211, "message": "Background task started"}