import logging  
import colorlog
import time
from agent_modules.langchain_imports import *
from agent_modules.errors import *
from agent_modules.makes_runnable import *

#ANSI Farben config
RED     = "\033[91m"  # hellrot
GREEN   = "\033[92m"  # hellgrün
BOLD    = "\033[1m"   # fett
UNDER   = "\033[4m"   # unterstrichen
RESET   = "\033[0m" 

#handler config
handler = colorlog.StreamHandler()
handler.setFormatter(colorlog.ColoredFormatter(
    "%(log_color)s%(asctime)s [%(levelname)s] %(message)s",
    log_colors={
        'DEBUG': 'cyan',
        'INFO': 'green',
        'WARNING': 'yellow',
        'ERROR': 'red',
        'CRITICAL': 'bold_red',
    }
))
logging.basicConfig(level=logging.DEBUG, handlers=[handler])

# jetzt bekomme ich nicht mehr diese verbosen loggs von den http clients
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)
logging.getLogger("requests").setLevel(logging.WARNING)
logging.getLogger("urllib3").setLevel(logging.WARNING)
logging.getLogger("http.client").setLevel(logging.WARNING)
logging.getLogger("langchain").setLevel(logging.WARNING)
logging.getLogger("groq").setLevel(logging.WARNING)

#debug wrappers
def debug_node(node_nmr:int=None,detailed:bool=True):
    def dekorator(func):
        def wrapper(state:dict):
            print(" \n")
            node_name = func.__name__
            start = time.perf_counter()
            logging.debug(f"Went in {BOLD}node-number: {node_nmr} | name: '{node_name}'")
            try:
                if detailed:
                    for state_prop,value in state.items():
                        logging.debug(f"Got the {BOLD}state: {state_prop} = {value}")
                result:dict = func(state)
                if detailed:
                    for state_prop,value in result.items():
                        logging.debug(f"returned the {BOLD}state: {state_prop} = {value}")
                logging.debug(f"Got out {BOLD}node-number: {node_nmr} | name: '{node_name}'")
                elapsed = (time.perf_counter() - start) * 1000
                logging.debug(f"Took:{BOLD} {elapsed:.2f} ms")
                print(" \n")
                return result 
            except Exception as e:
                logging.error(f"Error in{BOLD} node-number: {node_nmr} | name: '{node_name}' | Error: {e}")
                elapsed_err = (time.perf_counter() - start) * 1000
                logging.error(f"Took:{BOLD} {elapsed_err:.2f} ms")
                print(" \n")
                raise
        return wrapper
    return dekorator

def debug_callable(callable_type:Literal["func","method"],detailed:bool=True):
    def dekorator(func):
        def wrapper(*args, **kwargs):
            try:
                print(" \n")
                func_name = func.__name__
                start = time.perf_counter()
                if callable_type == "func":
                    logging.debug(f"went in {BOLD}{callable_type}: '{func_name}' ")
                elif callable_type == "method":
                    logging.debug(f"went in {BOLD}{callable_type}: '{func_name}' of the class: {args[0].__class__.__name__} ")
                else:
                    logging.error(f"{callable_type} ist ein invalider callable_type, es gehen nur: 'func' oder 'method' ")
                if detailed:
                    if args:
                        if callable_type == "method":
                            for arg in args[1:]:
                              logging.debug(f"Got the {BOLD}args: {arg}") 
                        else: 
                            for arg in args:
                                logging.debug(f"Got the {BOLD}args: {arg}")
                    if kwargs:
                        for k,v in kwargs.items():
                            logging.debug(f"Got the {BOLD}kwargs: {f"{k} = {v}"}")
                result = func(*args, **kwargs)
                if detailed:
                    logging.debug(f"{BOLD}returned: {result}")
                logging.debug(f"got out {BOLD}function: '{func_name}' ")
                elapsed = (time.perf_counter() - start) * 1000
                if detailed:
                    logging.debug(f"Took:{BOLD} {elapsed:.2f} ms")
                print(" \n")
                return result
            except Exception as e:
                logging.error(f"Error in {BOLD}{callable_type}: '{func_name}' | Exception: {e.__class__.__name__} | Error: {e} ")
                elapsed_err = (time.perf_counter() - start) * 1000
                logging.error(f"Took:{BOLD} {elapsed_err:.2f} ms")
                print(" \n")
                raise
        return wrapper
    return dekorator
    
if __name__ == "__main__":
    
    method_test:bool = True
    
    if method_test:
        class Test():
            @debug_callable("method")
            def hallo(self,name:str):
                print("was geht",name)
                #raise DB_Error("Simulierter Fehler")
                return "was geht",name
        
        test = Test()
        test.hallo(name=10)
    else:
        @debug_callable("func")
        def api_caller(bruh,hallo:str, was_get:int):
            respo = httpx.get("https://jsonplaceholder.typicode.com/users/1")
            real_respo = respo.json()
            return real_respo
        api_caller(True,hallo="moin",was_get=10)