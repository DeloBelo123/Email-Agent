from pydantic import BaseModel, Field
from typing import List,Optional
from enum import StrEnum

class SubscriptionTier(StrEnum):
    STARTER = "starter"
    ADVANCED = "advanced"
    PREMIUM = "premium"

class User(BaseModel):
    id:str
    email:str
class AccessObjekt(BaseModel):
    google_access_token:str
    google_refresh_token:Optional[str] = None
    user:User

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