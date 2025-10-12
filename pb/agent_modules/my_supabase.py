from supabase import create_client
from agent_modules.my_debbuger import logging
from agent_modules.langchain_imports import * 
from agent_modules.my_debbuger import *
from agent_modules.errors import *
from uuid import UUID
from dotenv import load_dotenv
import os
load_dotenv()


url = os.getenv("NEXT_PUBLIC_SUPABASE_URL") 
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)

# Data-Speicher Arten
T = TypeVar("T")

class Where(TD):
    column:str
    is_:str
class Order(TD):
    column:str
    descending:bool
    
class SupabaseTable(Generic[T]): 
        
    def __init__(self, table_name: str):
        self.table_name = table_name
        
    def insert(self, rows: list[T]):
        response = supabase.from_(self.table_name).insert(rows).execute()
        if not response.data:
            raise DB_Error(f"Error inserting data: {response.data}")
        logging.info(f"Inserted {len(rows)} rows into {self.table_name}")
        return response.data

    def select(self, columns:List[str], where: list[Where] = None, ordered_by:Order = None,limited_to:int = None):
        columns_string = ",".join(columns)
        query = supabase.from_(self.table_name).select(columns_string)
        if where:
            for condition in where:
                query = query.eq(condition['column'], condition['is_'])
        if ordered_by:
            query = query.order(column=ordered_by["column"],desc=ordered_by["descending"])
        if limited_to:
            query = query.limit(limited_to)
        response = query.execute()
        if not response.data:
            raise EmptyDBResponse(f"Error selecting data: No data found {response.data}")
        logging.info(f"Selected data from {self.table_name} with columns {columns}")
        return response.data

    def update(self, where: list[Where], update:T):
        query = supabase.from_(self.table_name).update(update)
        if where:
            for condition in where:
                query = query.eq(condition['column'], condition['is_'])
        response = query.execute()
        if not response.data:
            raise DB_Error(f"Error updating data: {response.data}")
        logging.info(f"Updated rows in {self.table_name} with conditions {where}")
        return response.data
    
    def upsert(self, rows: list[T],on_conflict:str):
        response = supabase.from_(self.table_name).upsert(rows,on_conflict=on_conflict).execute()
        logging.info(f"upserted {len(rows)} rows into {self.table_name}")
        return response.data

    def delete(self, where: list[Where]):
        query = supabase.from_(self.table_name).delete()
        for condition in where:
            query = query.eq(condition['column'], condition['is_'])
        response = query.execute()
        if not response.data:
            raise DB_Error(f"Error deleting data: {response.data}")
        logging.info(f"Deleted rows from {self.table_name} with conditions {where}")
        return response.data

class ChatHistory(TD):
    chat_id:UUID
    message_id:str
    role:Literal["human","ai"]
    content:str     
        
class AIChatHistory():
    
    def __init__(self,table_name:str):
        self.memory_table = SupabaseTable[ChatHistory](table_name=table_name)
        
    @debug_callable("method")
    def add_history(self,memory:List[ChatHistory]):
        added_memory = self.memory_table.insert(
            rows=memory
        )
        if added_memory == None:
            raise ChatHistoryError("Error bei 'add_history', history konnte nicht hinzugefügt werden")
        return added_memory
    
    @debug_callable("method")
    def select_history(self,where:List[Where],columns:List[str]):
        selected_memory = self.memory_table.select(
            columns=columns,
            where=where
        )
        if not selected_memory:
            raise ChatHistoryError("Error bei 'select_history', hisory konnte nicht gefetched werden")
        return selected_memory
    
    @debug_callable("method")
    def delete_history(self,where:List[Where]):
        deleted_history = self.memory_table.delete(
            where=where
        )
        return deleted_history 
          
class AIVectoreStore():
    
    def __init__(
        self,
        docs:List[Document],
        table_name:str = "documents",
        RPC_function:str = "match_documents"
        ):
        self.vectore_store = create_supabase_vektorstore(docs=docs,table_name=table_name,RPC_function=RPC_function)
        self.retriever = None
    
    @debug_callable("method")   
    def add_to_vektore_store(
        self,
        data:List,
        table_name:str = "documents",
        RPC_functions:str = "match_documents"
        ):
        docs = turn_to_docs(data)
        ids = add_docs_to_supabse_vektorestore(docs=docs,table_name=table_name,RPC_function=RPC_functions)
        if len(ids) == 0:
            raise VektoreStoreError("Error! es wurden keine docs hinzugefügt in 'add_to_vekore_store', die ids liste ist leer!")
        return ids
    
    @debug_callable("method")  
    def retrieve_vektorestore(
        self,
        query:str,
        table_name:str = "documents",
        RPC_functions:str = "match_documents"
        ):
        retrieved_docs = retrieved_supabase_vektorestore_docs(query=query,table_name=table_name,RPC_function=RPC_functions)
        if len(retrieved_docs) == 0:
            raise VektoreStoreError("Error! es wurden keine docs retrieved in 'retrieve_vektorestore', das array ist leer! ")
        cleaned_data_array = [retrieved_doc.page_content for retrieved_doc in retrieved_docs]
        data_as_long_string = " ".join(cleaned_data_array)
        return data_as_long_string
        
    @debug_callable("method")
    def as_retriever(self):
        retriever = self.vectore_store.as_retriever()
        self.retriever = retriever
        return retriever
    
    # short-cuts für simplere syntax
    def __sub__(self,query:str): 
        if self.retriever:
            docs = self.retriever.get_relevant_documents(query)
            data = [doc.page_content for doc in docs]
            data_as_long_str = " ".join(data)
            return data_as_long_str
        data = self.retrieve_vektorestore(query)
        return data
    
    def __add__(self,data:Iterable):
        ids = self.add_to_vektore_store(data)
        return ids       

# Vektore DB spezifizierung
embedder = OllamaEmbeddings(model="nomic-embed-text")   
splitter = RecursiveCharacterTextSplitter(chunk_size = 600 , chunk_overlap = 80)

def create_supabase_vektorstore(docs:List[Document],table_name:str="documents",RPC_function:str="match_documents"):
    splitted_docs = splitter.split_documents(docs) 
    vektor_store = SupabaseVectorStore.from_documents(
        documents=splitted_docs,
        embedding=embedder,
        client=supabase,
        table_name=table_name,
        query_name=RPC_function,
    )
    return vektor_store

def add_docs_to_supabse_vektorestore(docs:List[Document],table_name:str="document",RPC_function:str="match_documents") -> List[str]:
    splitted_docs = splitter.split_documents(docs)
    vectore_store = SupabaseVectorStore(
    client=supabase,
    embedding=embedder,
    table_name=table_name,
    query_name=RPC_function
)
    document_ids:List[str] = vectore_store.aadd_documents(splitted_docs)
    return document_ids
    
def retrieved_supabase_vektorestore_docs(query:str,table_name:str="document",RPC_function:str="match_documents") -> List[Document]:
    vektor_store = SupabaseVectorStore(
    client=supabase,
    embedding=embedder,
    table_name=table_name,
    query_name=RPC_function
)
    retriever = vektor_store.as_retriever()
    searched_docs:List[Document] = retriever.get_relevant_documents(query)
    return searched_docs
   
if __name__ == "__main__":
    # testing
    class MailTableStrukture(TD):
        Email:object
        mail_nmr:int
    mail_table = SupabaseTable[MailTableStrukture]("mails")
    mail_table.insert(rows=[
        {"Email": "hi", "Name": "Delo Jindyschwesch", "Text": "Hallo, ich bin Delo und ich bin 17 Jahre alt!"},
        {"Email": "hi2", "Name": "Delo Jindyschwesch", "Text": "Hallo, ich bin Delo und ich bin 17 Jahre alt!"},
        {"Email": "hi3", "Name": "Delo Jindyschwesch", "Text": "Hallo, ich bin Delo und ich bin 17 Jahre alt!"}
    ])

    get_table = mail_table.select(columns=["*"])

    get_ein_teil_von_table = mail_table.select(
        columns="Email,Name,Text",
        where=[{"column": "Email", "is": "hi"},{"column": "Name", "is": "Delo Jindyschwesch"}] # "AND-operator", conditions stack
    )

    update_table = mail_table.update(
        update={"Name": "Delo Jindyschwesch"},
        where=[{"column": "Email", "is": "hi"}]
    )

    delete_table = mail_table.delete(
        where=[{"column":"name","is":"Delo"}]
    )
    
    dummy_data = [1,2,3,4,5,6,7,8,9,10]
    dummy_vectore_store = AIVectoreStore(docs=[Document(page_content=zahl) for zahl in dummy_data])
    
    class Test(TD):
        a:int
        b:int
    dummy_table_memory = SupabaseTable[Test]("test")
    
    dummy_chat_history = AIChatHistory(table_name="chat_history")
    
    v_db = AIVectoreStore()
    data = v_db - "wie geht es dir?"
    response = v_db + ["ich bin Delo","ich mag Döner","ich mag spaghetti"]
    
    

    