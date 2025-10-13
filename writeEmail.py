from pb.agent_modules.fastapi_config import *
from pb.agent_modules.my_agents import *
from pb.tools.file_functions import read_file
from readEmail import AccessObjekt
from redis import Redis
from celery import Celery

router = APIRouter()
redis = Redis(host='localhost', port=6380, db=0)
celery = Celery("email_tasks",broker="redis://localhost:6380/0",backend="redis://localhost:6380/0")

class MetaData(BaseModel):
    from_:str
    to:str
    subject:str
class UserInput(BaseModel):
    meta_data:MetaData
    content:str
    
class EmailOutputSchema(BaseModel):
    from_:str
    to:str
    subject:str
    content:str
    
class FrontendReq(AccessObjekt):
    email:EmailOutputSchema # der grund warum ich email diesem Typ gebe liegt daran weil ich im Frontend die von 'def make()' generierte mail, welches ja logisch auch diese struktur hat, zurück schicke an 'def send()' welches ich dann final abschicke

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
  
@app.post("/create_email/test3")
def make(user_input:UserInput):
    email_writer = LLMChain[BaseInvokeSchema,EmailOutputSchema](
        name="Email_writer",
        description="schreibt Emails nach willen des users",
        prompt=[
            ("system", """
                Du bist ein hochprofessioneller E-Mail-Schreiber für einen Immobilienmakler. Deine Aufgabe ist es, authentische, menschliche und professionelle E-Mails zu verfassen, die Vertrauen schaffen und Geschäfte abschließen.

                ## DEINE IDENTITÄT:
                - **Erfahrener Immobilienmakler** mit 15+ Jahren Erfahrung
                - **Menschlich und authentisch** - keine Roboter-Sprache
                - **Professionell aber warmherzig** - wie ein vertrauensvoller Berater
                - **Lösungsorientiert** - immer den Kunden im Fokus

                ## SCHREIBSTIL-REGELN:
                1. **Persönlich und direkt** - "Hallo Herr/Frau [Name]" statt "Sehr geehrte Damen und Herren"
                2. **Kurz und prägnant** - Maximal 3-4 Absätze, keine Romane
                3. **Aktiv statt passiv** - "Ich sende Ihnen..." statt "Es wird Ihnen gesendet..."
                4. **Konkret statt vage** - "Morgen um 14 Uhr" statt "bald"
                5. **Vertrauensvoll** - "Gerne helfe ich Ihnen" statt "Wir werden versuchen"

                ## IMMOBILIEN-SPEZIFISCHE ELEMENTE:
                - **Objekt-Referenzen**: "Die Immobilie in der Musterstraße 123"
                - **Termine**: "Besichtigung am [Datum] um [Uhrzeit]"
                - **Preise**: "Der Kaufpreis beträgt 450.000€"
                - **Nächste Schritte**: "Ich melde mich bis [Datum] bei Ihnen"
                - **Kontakt**: "Bei Fragen erreichen Sie mich unter..."

                ## TONALITÄT NACH KUNDENTYP:
                - **Interessenten**: Warm, einladend, informativ
                - **Verkäufer**: Respektvoll, kompetent, ergebnisorientiert
                - **Behörden**: Formal aber freundlich, sachlich
                - **Kollegen**: Professionell, effizient, kooperativ

                ## QUALITÄTSKONTROLLE:
                - Prüfe Rechtschreibung und Grammatik
                - Verwende deutsche Umlaute korrekt
                - Keine Abkürzungen (außer "z.B.", "etc.")
                - Professionelle E-Mail-Signatur

                ## OUTPUT-STRUKTUR:
                - from_: Absender-E-Mail (aus MetaData)
                - to: Empfänger-E-Mail (aus MetaData)  
                - subject: Prägnanter Betreff (aus MetaData oder generiert)
                - content: Professioneller E-Mail-Inhalt

                Du bist ein Meister der Immobilien-Kommunikation. Schreibe E-Mails, die Kunden überzeugen und Geschäfte zum Erfolg führen.
                        """),
                        ("human", """
                Schreibe eine authentische, menschliche und professionelle E-Mail, die den Empfänger überzeugt und das gewünschte Ziel erreicht.
            """)
        ],
        output_structure=EmailOutputSchema
    )
    #email_writer.add_context([read_file("email_writer_rag.txt")])

    respo = email_writer.invoke({
        "input":[user_input.content,user_input.meta_data]
    })
    logging.info(f'''
das hier ist die von {email_writer.name} generierte Email:
from:{respo.from_},\n
to:{respo.to},\n
subject:{respo.subject},\n
content:{respo.content}\n
    ''')
    email = {
        "from":respo.from_,
        "to":respo.to,
        "subject":respo.subject,
        "content":respo.content
    }
    return {"status":202,"email":email}

@router.post("/send_email/test3")
def send(req:FrontendReq):
    email = req.email
    try:
        respo = send_mail(
            access_objekt = req, 
            from_ = email.from_,
            to = email.to,
            subject = email.subject,
            content = email.content
        )
        print(f"die Respo von 'send_amil': {respo}")
    except Exception as e:
        raise(f"Error beim email senden: Exception: {e.__class__.__name__} | Error: {e}")

router.post("/auto_send_email/test3")    
def auto_send():
    pass
        