import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from agent_modules.http_client import client 
from agent_modules.my_debbuger import debug_callable
from pydantic import BaseModel,Field
from typing import List,TypedDict,Dict,Any
import time, hmac, hashlib

on_office_key = os.getenv("ONOFFICE_API_KEY")
on_office_secret = os.getenv("ONOFFICE_SECRET_KEY")

class Result(BaseModel):
    actionid:str
    resourcetype:str
    resourceid:str
    message:str
class OutputStrukture(BaseModel):
    status:str
    results:List[Result]
    errors:List[str] | None = None

class KalendarError(Exception):
    ...
    
class Action(TypedDict):
    actionid: str                
    resourcetype: str        
    resourceid: str          
    identifier: str             
    timestamp: str               
    hmac: str
    hmac_version: str            
    parameters: Dict[str, Any]
  
class CalendarEntryParameters(BaseModel):
    subject: str = Field(description="Titel des Termins. Kurz und prägnant, maximal 100 Zeichen.")
    start: str = Field(description="Startzeit des Termins im Format 'YYYY-MM-DD HH:MM:SS', z.B. '2025-10-10 10:00:00'. Zeitzone: lokal.")
    end: str = Field(description="Endzeit des Termins im Format 'YYYY-MM-DD HH:MM:SS'. Muss nach 'start' liegen.")
    location: str = Field(description="Ort des Termins. Kurzbezeichnung, Adresse oder Raumname.")
    description: str = Field(description="Ausführliche Beschreibung des Termins. Frei formulierbar, kann mehrere Sätze enthalten.")
    reminder: str = Field("15",description="Erinnerungszeit in Minuten vor Terminbeginn. Muss als String übermittelt werden, z.B. '15'.")
    
class OnOfficeClient():
    ''' kann und wird wahrscheinlich fehler anfällig sein, lass nochmal von cursor die docs checken und korrekt debuggen '''
    def __init__(self,api_key:str = None,secret_key:str = None):
        self.api_key = api_key
        self.secret_key = secret_key
        self.time_stamp = int(time.time())
        payload_for_hmac = f"{self.time_stamp}{self.api_key}"
        self.hmac_hash = hmac.new(
            self.secret_key.encode(),
            payload_for_hmac.encode(),
            hashlib.sha256
        ).hexdigest() if secret_key else "EGAL"

    @debug_callable("func")
    def update_calendar(self,parameter:CalendarEntryParameters):
        respo = client.post_data(
            url="https://api.onoffice.de/api/latest/api.php",
            apikey=self.api_key,
            strukture=OutputStrukture,
            body={
                "token": self.api_key,
                "request": {
                    "actions": [
                            {
                                "actionid": "create",
                                "resourcetype": "calendar",
                                "resourceid": "",            
                                "identifier": "",           
                                "timestamp": self.time_stamp,
                                "hmac": self.hmac_hash,
                                "hmac_version": "2",
                                "parameters": parameter.model_dump()
                            }
                        ]
                    }
                }
        )
        if respo.status != "success":
            raise KalendarError("Fehler beim Kalendar abrufen!")

onOffice_client = OnOfficeClient(
    api_key = on_office_key,
    secret_key = on_office_secret
)

def update_calendar_tool(subject: str, start: str, end: str, location: str, description: str, reminder: str = "15"):
    ''' Tool für AI - erstellt Termin im onOffice Kalender '''
    parameter = CalendarEntryParameters(
        subject=subject,
        start=start,
        end=end,
        location=location,
        description=description,
        reminder=reminder
    )
    onOffice_client.update_calendar(parameter)