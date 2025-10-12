from agent_modules.my_debbuger import *
from typing import Optional,Type,Literal,TypeVar,TypedDict,get_type_hints
from pydantic import BaseModel
from agent_modules.makes_runnable import *
import pydantic
import httpx
import os

@debug_callable("func")
def turn_into_basemodel(respo:dict,basemodel_name:str,return_instance:bool = False) -> Type[BaseModel] | object:
    fields = {} 
    for key, value in respo.items(): # gehe durch alle keys und values im dict
        if isinstance(value, dict): # prüfe ob value ein dict ist, wenn ja rufe die function nochmal auf mit dem value als dict
            submodel = turn_into_basemodel(value,f"{basemodel_name}_{key}") # rekursiver aufruf, erstellt ein submodel
            fields[key] = (submodel, ...) # das basemodel 'submodel' jetzt auch in fields einfügen damit wir am ende mit create_model das basemodel erstellen
            respo[key] = submodel(**value)
            logging.info(f"ein submodel wurde erstellt:{submodel.__name__}")
        elif isinstance(value, list) and value and all(isinstance(i, dict) for i in value): # prüft ob eine value eine list ist, ob diese list values hat und ob die values dieser list dicts sind, wenn ja wird der block ausgeführt wo du vom ersten Itemd der liste ein basemodel erstellst und dann List[listbasemodel]
            submodel = turn_into_basemodel(value[0], f"{basemodel_name}_{key}_Item")
            fields[key] = (List[submodel], ...)
            respo[key] = [submodel(**item) for item in value]
            logging.info(f"Ein Submodel für Liste erstellt: {submodel.__name__}")
        else:
            fields[key] = (type(value), ...) # wenn kein dict ist, einfach in fields normal einfügen
    model = pydantic.create_model(basemodel_name, **fields) # das erstellen des basemodels
    def get_type_name(annotation): # gibt von der annotation den type (annotation sind von der basemodel model_fields methode objects die den type der klasse haben)
        if hasattr(annotation, '__name__'):
            return annotation.__name__
        else:
            return str(annotation)# Fallback für komplexe Typen
    model_fields = [f"{key}: {get_type_name(field_info.annotation)}" for key, field_info in model.model_fields.items()]
    logging.warning(f"{basemodel_name}s BaseModel-fields:\n {"\n ".join(model_fields)} ")
    if return_instance:
        instance = model(**respo)
        return instance
    else:
        return model
    
#schade..., kackt rein das für den '<class 'list'> != typing.List[realEmail.Email' ist    
def models_are_equal(model_a: Type[BaseModel], model_b: Type[BaseModel]) -> bool:
    hints_a = get_type_hints(model_a)
    hints_b = get_type_hints(model_b)
    if hints_a == hints_b:
        logging.info(f"die Modelle {model_a.__name__} und {model_b.__name__} stimmen sich überein!✅")
        return True
    else:
        logging.warning(f"die Modelle {model_a.__name__}:{hints_a} und {model_b.__name__}:{hints_b} stimmen sich nicht überein!")
        return False

T = TypeVar("T", bound=BaseModel)
    
class HTTPClient:
    def __init__(
        self,base_url:Optional[str] = None,
        apikey:Optional[str] = None
        ):
        self.base_url = base_url
        self.apikey = apikey
    
    @debug_callable("method")
    def strukture(
        self,
        url:Optional[str] = None,
        basemodel_name:Optional[str] = "HTTP_Model",
        method:Literal["GET","POST"] = "GET",
        body:Optional[dict] = None,
        apikey:Optional[str] = None,
        params:Optional[dict] = None,
        ) -> Type[BaseModel]:
        ''' 
        creates a pydantic BaseModel from the json-response of the url, returns the basemodel class as well as logging the fields of the basemodel.
        because it is dynamicly created, it sadly does not have any autocomplete (but still type safety) for wich you can create a own BaseModel by
        just copy pasting the logged fields
        '''
        if method == "GET":
            respo = self.get(
                url = url or self.base_url,
                apikey = apikey,
                params = params
            )
        elif method == "POST":
            respo = self.post(
                url = url or self.base_url,
                body = body or {},
                apikey = apikey,
                params = params    
            )
        else:
            raise IgnoredLiterals("Error! nur GET und POST sind erlaubt als method!")                
        logging.info(f"{basemodel_name}s dejsoned response from the server: {respo}")   
        model = turn_into_basemodel(respo,basemodel_name)
        return model

    
    @debug_callable("method")
    def get_data(
        self,
        url:Optional[str] = None,
        strukture:Optional[Type[T]] = None,
        apikey:Optional[str] = None,
        params:Optional[dict] = None
        ):
        ''' validates the urls respo by the strukture , if given, as an BaseModel, also returnst the basemodel-obj if given else just response the dict from the server '''
        respo = httpx.get(
            url = url or self.base_url,
            headers = {         
                "Authorization": f"Bearer {apikey or self.apikey}",
                "Content-Type": "application/json"
            },
            params=params
        )
        respo.raise_for_status()
        if not respo:
            raise NoneResponse("Error! retruned None by 'get' call")
        dejsonded_respo = respo.json()
        if strukture:
            validated_obj = strukture.model_validate(dejsonded_respo)
            return validated_obj
        else:
            return dejsonded_respo


    @debug_callable("method")
    def post_data(
        self,
        url:Optional[str] = None,
        body:Optional[dict] = None,
        strukture:Optional[Type[T]] = None,
        apikey:Optional[str] = None, 
        params:Optional[dict] = None):
        ''' validates the urls respo by the strukture , if given, as an BaseModel, also returnst the basemodel-obj if given else just response the dict from the server '''
        respo = httpx.post(
            url = url or self.base_url,
            headers = {        
                "Authorization": f"Bearer {apikey or self.apikey}",
                "Content-Type": "application/json"
            },
            json = body,
            params=params
        )
        respo.raise_for_status()
        if not respo:
            raise NoneResponse("Error! retruned None by 'post' call")
        dejsonded_respo = respo.json()
        if strukture:
            validated_obj = strukture.model_validate(dejsonded_respo)
            return validated_obj
        else:
            return dejsonded_respo


client = HTTPClient()

if __name__ == "__main__":
    
    #simple_usecase:
    
    #with my module
    ''' full monotoring, error handling, dejson-fining, etc... '''
    respo = client.get("https://jsonplaceholder.typicode.com/todos/1")
    
    #without my module
    timer = time.perf_counter()
    try:
        respo = httpx.get("https://jsonplaceholder.typicode.com/todos/1")
        if respo.status_code != 200:
            raise Exception(f"Error! status code: {respo.status_code}")
        dejsonded_respo = respo.json()
    except Exception as e:
        logging.error(f"Error: {e}") 
        raise
    finally:
        elapsed_err = (time.perf_counter() - timer) * 1000
        logging.debug(f"Took: {elapsed_err:.2f} ms")
        logging.debug(f"Error: {e}")
    
    
    #complex_usecase:
    
    ''' full typesaftey, autocomplete, strukture, defensive, etc... '''
    
    client.strukture("https://jsonplaceholder.typicode.com/todos/1","Todo") #here i get the strukture printed
    
    class Todo(BaseModel): # copy pasted from the log
        userId: int
        id: int
        title: str
        completed: bool
    respo = client.get("https://jsonplaceholder.typicode.com/todos/1",Todo)

    #spezialized client
    
    client.strukture("https://jsonplaceholder.typicode.com/todos/1","User","GET") #strukture of an get req
    client.strukture("https://jsonplaceholder.typicode.com/posts","Respo","POST",{"name":"","age":0}) #strukture of an post req
    
    #or more readable:
    
    client.strukture(
        url = "https://jsonplaceholder.typicode.com/todos/1",
        basemodel_name = "User",
        method = "GET"
    )
    
    client.strukture(
        url = "https://jsonplaceholder.typicode.com/posts",
        basemodel_name = "Respo",
        method = "POST",
        body = {
            "name":"",
            "age":0
        }
    )
    
    class User(BaseModel):
        userId: int
        id: int
        title: str
        completed: bool 
        
    class Respo(BaseModel):
        status:int
        info:str

    spezial_client = HTTPClient(
        base_url = "https://jsonplaceholder.typicode.com/todos/1",
        apikey = os.getenv("API_KEY"),
        output_strukture = {
            "GET_respo_strukture": User,
            "POST_respo_strukture": Respo
        }
    )

    spezial_respo_GET = spezial_client.get()
    spezial_respo_POST = spezial_client.post({
        "name":"delo",
        "aget":123
    })


























   
''' ab jetzt kommt niemandsland... kann sein das ich jetzt massiv Zeit verschwende '''

'''K = TypeVar("K", bound=BaseModel)
class GET(Generic[K]):
    def __init__(self,strukture:Type[K]):
        self.strukture = strukture
    
    def from_url(
        self,
        url:str,
        apikey:Optional[str] = None,
        params:Optional[dict] = None
        ):
         validates the urls respo by the strukture , if given, as an BaseModel, also returnst the basemodel-obj if given else just response the dict from the server 
        try:
            respo = httpx.get(
                url = url,
                headers = {         
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                },
                params=params
            )
            respo.raise_for_status()
            dejsonded_respo = respo.json()
            if self.strukture:
                validated_obj = self.strukture.model_validate(dejsonded_respo)
                return validated_obj
            else:
                return dejsonded_respo
        except Exception:
            raise

class POST(Generic[K]):
    def __init__(self,strukture:Type[K]):
        self.strukture = strukture
    
    def to_url(
        self,
        url:str,
        body:dict,
        token:Optional[str] = None, 
        params:Optional[dict] = None):
        validates the urls respo by the strukture , if given, as an BaseModel, also returnst the basemodel-obj if given else just response the dict from the server 
        try:
            respo = httpx.post(
                url = url,
                headers = {        
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                },
                json = body,
                params=params
            )
            respo.raise_for_status()
            dejsonded_respo = respo.json()
            if self.strukture:
                validated_obj = self.strukture.model_validate(dejsonded_respo)
                return validated_obj
            else:
                return dejsonded_respo
        except Exception:
            raise
        
class new_HTTPClient:
    def __init__(self,base_url:Optional[str] = None):
        self.base_url = base_url
    
    def get(self,url:str,strukture:Type[K]) -> GET[K].from_url:
        return GET(strukture).from_url(url)
    
    def post(self,url:str,strukture:Type[K]) -> POST[K].to_url:
        return POST(strukture).to_url(url)
    
    def test(
        self,
        method:Literal["GET","POST"],
        url:str,
        body:Optional[dict] = None,
        token:Optional[str] = None,
        params:Optional[dict] = None):
        just a test methode to see if the api is working and what it returns, returns the dict from the server
        try:
            if method == "GET":
                respo = httpx.get(
                    url = url or self.base_url,
                    headers = {        
                        "Authorization": f"Bearer {token}",
                        "Content-Type": "application/json"
                    },
                    params=params
                )
                respo.raise_for_status()
                dejsonded_respo = respo.json()
                logging.warning(f"Response from the server: {dejsonded_respo}")
                return dejsonded_respo
            elif method == "POST":
                respo = httpx.post(
                    url = url or self.base_url,
                    headers = {        
                        "Authorization": f"Bearer {token}",
                        "Content-Type": "application/json"
                    },
                    json = body,
                    params=params
                )
                respo.raise_for_status()
                dejsonded_respo = respo.json()
                logging.warning(f"Response from the server: {dejsonded_respo}")
                return dejsonded_respo
            else:
                raise Exception("Error! nur GET und POST sind erlaubt als method!")
        except Exception:
            raise
    
new_client = new_HTTPClient()'''
    