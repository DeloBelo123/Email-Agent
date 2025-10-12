from cryptography.fernet import Fernet
from typing import Any
import os

def get_encryption_key():
    ''' guck in deine console, da wird der key geprinted.du musst diesen nehmen un in deine .env file speichern'''
    key = Fernet.generate_key()
    key_str = key.decode()
    print(f"ENCRIPTION_KEY: {key_str}")
    
def encrypt_toBytes_asString(object:Any,key = None):
    '''
        Was hier geschieht: du gibst ein objekt wie z.B ein string als parameter 
        das du gerne gecrypted hättest. er wandelt dein input in bites um, und diese
        bites (damit die kompertibel sind) wieder in strings um. somit hast du 
        einen gecrypteten string aus bites die dein input representieren
        
        notitzt: wenn du ein json-objekt encrypten willst, wandle es zuerst in ein
        string um, kannst es danach wieder de-stringen
    '''
    if key is None:
        key = os.getenv("ENCRYPTION_KEY").encode()
    fernet = Fernet(key)
    encrypted_object = fernet.encrypt(object.encode())
    encrypted_object_str = encrypted_object.decode()
    return encrypted_object_str  

def decrypt_toNormal(object:str, key = None):
    '''
        Was hier geschieht: du hast ja vorher eine encryption gemacht, wo du ein input
        in bites und dann in einem string umgewandelt hast. hier wandelst du den string
        der die bites enthält wieder in bites um und decodest die so das man deine original
        value wieder da ist
        
        notitzt: wenn du ein json-objekt-string decrypten willst, kannst du es wieder
        in ein json objekt umwandeln durch die json.loads von der json module
    '''
    if key is None:
        key = os.getenv("ENCRYPTION_KEY").encode()
    fernet = Fernet(key)
    from_biteString_to_object_bytes = object.encode()
    decrypted_value = fernet.decrypt(from_biteString_to_object_bytes).decode()
    return decrypted_value

get_encryption_key()


