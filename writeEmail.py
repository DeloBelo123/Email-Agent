from pb.agent_modules.fastapi_config import *
from pb.agent_modules.my_agents import *
from dataModels import AccessObjekt
from projektAgents import email_writer,UserInput,EmailOutputSchema
from redis import Redis
from celery import Celery
import base64
from email.message import EmailMessage

router = APIRouter()
redis = Redis(host='localhost', port=6379, db=0)
celery = Celery("email_tasks",broker="redis://localhost:6379/0",backend="redis://localhost:6379/0")

class Req(AccessObjekt):
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

@celery.task
def send_mail(access_objekt:Type[AccessObjekt],from_,to,subject,content):
    raw_mail = create_mail_as_bytes(from_,to,subject,content)
    access_token = access_objekt.google_access_token
    respo = client.post_data(
        url="https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        apikey=access_token,
        body={"raw":raw_mail}
    )
    print(f"respo der 'send_mail' function: {respo}")
  
@app.post("/create_email/test3")
def make(user_input:UserInput):
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
def send(req:Req):
    email = req.email
    try:
        respo = send_mail(
            access_objekt = req, 
            from_ = email.from_,
            to = email.to,
            subject = email.subject,
            content = email.content
        )
        print(f"die Respo von 'send_mail' von 'send': {respo}")
    except Exception as e:
        raise(f"Error beim email senden: Exception: {e.__class__.__name__} | Error: {e}")


@router.post("/auto_send_email/test3")    
def auto_send(req:Req):
    email = req.email
    try:
        respo = send_mail.apply_async(
            args = [req, email.from_, email.to, email.subject, email.content],
            countdown = 1200  # 20 Minuten Delay
        )
        redis.sadd(f"pending_auto_responses:{req.user.id}",respo.id)
        print(f"die Respo von 'send_mail' von 'auto_send': {respo}")
        return {"status": 202, "message": "Auto-response scheduled", "task_id": respo.id}
    except Exception as e:
        raise(f"Error beim auto email senden: Exception: {e.__class__.__name__} | Error: {e}")


        