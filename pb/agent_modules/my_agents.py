import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agent_modules.langchain_imports import *
from tools.file_functions import *
from tools.email_fuctions import *
from agent_modules.my_debbuger import *
from agent_modules.my_supabase import *
from agent_modules.errors import *
from tools.file_functions import create_file
from agent_modules.http_client import turn_into_basemodel,models_are_equal
from abc import ABC,abstractmethod
import json
load_dotenv()

dev_mode = os.getenv("DEV_MODE","False").lower() == "true"

llm = OllamaLLM(model="llama2") if dev_mode else ChatGroq(
    groq_api_key = os.getenv("CHATGROQ_API_KEY"),
    model_name = "llama-3.3-70b-versatile" 
)

class NoInput(BaseModel):
    ...

class Done(BaseModel):
    ''' das hier ist das Outputschema für Agents die eigentlich nichts returnen sondern nur eine Aufgabe erledigen '''
    done:bool = Field(description="hier sagst du ob die aufgabe erledigt ist oder nicht")

class BaseInvokeSchema(TD):
    input:str
    
class BaseOutputSchema(BaseModel):
    content:Any = Field(description="hier kommt deine generierte response rein")
    
class AgentTool():
    def __init__(self,name:str,description:str,input_schema:Type[BaseModel],func:Callable):
        self.name = name
        self.description = description
        self.input_schema = input_schema
        self.func = func
    
I = TypeVar("I")
K = TypeVar("K",bound = BaseModel)
P = ParamSpec("P")

class AIBluePrint(ABC):
    '''
        die AIBluePrint klasse ist die parent-class aller AI-invokables.
        Grund-methoden:
        -> 'invoke' = ruft die AI auf
        -> 'add_context' = gibt der AI context-data worauf er sich beim invoke beziehen kann
    '''
    def __init__(
        self,
        output_structure:Optional[Type[BaseModel]] = None,
        is_llm:bool = False,
        prompt:List[Tuple[Literal["human","system"],str]| MessagesPlaceholder] = None,
        name:Optional[str] = None,
        description:Optional[str] = None,
    ):
        self.name = name if name else None
        self.description = description if description else None
        self.json_parser = JsonOutputParser(pydantic_object = output_structure) if is_llm and output_structure else None
        if is_llm:
            self.prompt = ChatPromptTemplate.from_messages(prompt).partial(format_instructions = self.json_parser.get_format_instructions())
        else:
            self.prompt = ChatPromptTemplate.from_messages(prompt)
    
    @abstractmethod
    def add_context(self,context):
        ...
          
    @abstractmethod   
    def invoke(self,invoke_dict:I):
        ...

       
class LLMChain(AIBluePrint,Generic[I,K]):
    '''
        Defaults:\n
        super().__init__(\n
            prompt = [\n
                MessagesPlaceholder("context"),\n
                ("system","these are your format-instructions:{format_instructions}"),\n
                ("human", "{input}"),\n
            ] + (prompt or []),\n
            name = name or "LLM Chain",\n
            description = description or "keine beschreibung gegeben",\n
            output_structure = output_structure,\n
            is_llm = True\n
        )\n
        self.__vectore_store = None\n
        self.__retrieval_chain = None\n
        try:\n
            self.chain =  self.prompt | llm | self.json_parser\n
        except AIError as e:\n
            logging.error(f"error beim erstellen vom LLMChain '{self.name}', Error: {e}")\n
            raise\n   
    '''
    def __init__(
        self,
        output_structure:K ,
        prompt:List[Tuple[Literal["human","system"],str]| MessagesPlaceholder] = None,
        name:Optional[str] = None,
        description:Optional[str] = None,
    ):
        super().__init__(
            prompt = [
                MessagesPlaceholder("context"),
                ("system","these are your format-instructions:{format_instructions}"),
                ("human", "{input}"),
            ] + (prompt or []),
            name = name or "LLM Chain",
            description = description or "keine beschreibung gegeben",
            output_structure = output_structure,
            is_llm = True
        )
        self.output_structure = output_structure
        self.__vectore_store = None
        self.__retrieval_chain = None
        try:
            self.chain =  self.prompt | llm | self.json_parser
        except AIError as e:
            logging.error(f"error beim erstellen vom LLMChain '{self.name}', Error: {e}")
            raise
    
    @debug_callable("method")  
    def add_context(self,data:List[str],table_name: str = "documents",RPC_function: str = "match_documents"):
        docs = turn_to_docs(data)
        if self.__vectore_store:
            ids = self.__vectore_store.add_to_vektore_store(
                docs=docs,
                RPC_function=RPC_function,
                table_name=table_name
            )
            if not ids:
                raise VektoreStoreError(f"Error! bei {self.name} wurden bei der 'add_context' methode nichts in den Vektorestore hinzugefügt! ")
            success = f"die docs wurden erfolgreich hinzugefügt, hier die ids:{ids}"
            logging.info(success)
            return success
        else:
            self.__vectore_store = AIVectoreStore(
                docs=docs,
                RPC_function=RPC_function,
                table_name=table_name
            )
            retriever = self.__vectore_store.as_retriever()
            stuff_chain = create_stuff_documents_chain(
                llm=llm,
                prompt=self.prompt,
                output_parser=self.json_parser
            )
            retrieval_chain = create_retrieval_chain(
                combine_docs_chain=stuff_chain,
                retriever=retriever
            )
            self.__retrieval_chain = retrieval_chain
            return self
       
    @debug_callable("method") 
    def invoke(self,invoked_dict:I) -> K:
        if "context" not in invoked_dict and not self.__retrieval_chain:
            invoked_dict["context"] = []
        chain = self.__retrieval_chain or self.chain
        ai_respo = chain.invoke(invoked_dict)
        if ai_respo == None:
            raise AINoResponeError(f"Error! die LLChain: {self.name} hat beim invoke None returned")
        ai_respo_instance = turn_into_basemodel(
            respo=ai_respo,
            basemodel_name="LLM_Respo",
            return_instance=True
        )
        return ai_respo_instance


class Architect():
    def __init__(self,output_strukture:Type[BaseModel],name:Optional[str] = None):
        Name = name or ""
        self.__architect = LLMChain[BaseInvokeSchema,output_strukture](
            name=f"Architect {Name}",
            description="An output-architect who struktures your output, made for strukturing LLM Outputs",
            output_structure=output_strukture,
            prompt=[("system","du bist ein output-formater der jeglichen input AUSNAHMSLOS und OHNE JEGLICHEN TEXT DAZU in die vorgegebene struktur umwandelt und zurück gibt")]
        )
        
    def structure(self,input:Any,as_dict:bool = False):
        structured_respo = self.__architect.invoke({
            "input":input
        })
        respo = structured_respo.model_dump() if as_dict else structured_respo
        return respo
    
def structure(schema:Type[T],data:Any) -> T:
    architect = Architect(schema)
    respo = architect.structure(data)
    return respo
            
def output_structured_by_architect(OutputSchema:Type[K]) -> Callable[[Callable[P, Any]], Callable[P, K]]:
    def dekorator(func:Callable[P, Any]) -> Callable[P, K]:
        @debug_callable("func")
        def llm_wrapper(*args,**kwargs) -> K:
            architect = Architect(OutputSchema,"Wrapper")
            tool_result = func(*args,**kwargs)  
            respo = architect.structure(tool_result)
            if respo == None:
                raise AINoResponeError("Fehler, architect response ist 'None' ")
            print(f"tool_result: {tool_result}\n")
            print(f"full_llm_respo: {respo}\n")
            return respo
        return llm_wrapper
    return dekorator

def ts_tool(name:str,description:Optional[str] = None,url:str ="http://localhost:4000/mcp_server/tools", **paramters):
    respo = client.post_data(url=url,body={**paramters})
    return respo

class OneCallAgent(AIBluePrint,Generic[I,K]):
    '''
        Defaults:\n
        super().__init__(\n
            prompt = [\n
                MessagesPlaceholder("context"),\n
                ("human","{input}"),\n
            ] + (prompt or []),\n
            name = name or "Onecall Agent",\n
            description = description or "keine beschreibung gegeben",\n
        )\n
        self.__vectore_store = None\n
        self.retrieval_chain = None\n
        self.architect = Architect(output_structure,'Onecall_Agent')\n
        self.__agent_tools = [StructuredTool.from_function(\n
                name=tool.name,\n
                description=tool.description,\n
                args_schema=tool.input_schema,\n
                func=tool.func\n
            )for tool in tools]\n
        self.llm_with_tools = llm.bind_tools(self.__agent_tools)\n
        self.agent = self.prompt | self.llm_with_tools\n
    '''
    def __init__(
        self,
        tools:List[AgentTool],
        output_structure:K,
        prompt:List[Tuple[Literal["human","system"],str]| MessagesPlaceholder] = None,
        name:Optional[str] = None,
        description:Optional[str] = None,
    ):
        super().__init__(
            prompt = [
                MessagesPlaceholder("context"),
                ("human","{input}"),
            ] + (prompt or []),
            name = name or "Onecall Agent",
            description = description or "keine beschreibung gegeben",
        )
        self.__vectore_store = None
        self.retrieval_chain = None
        self.architect = Architect(output_structure,'Onecall_Agent')
        self.__agent_tools = [StructuredTool.from_function(   
                name=tool.name,
                description=tool.description,
                args_schema=tool.input_schema,
                func=tool.func
            )for tool in tools]
        self.llm_with_tools = llm.bind_tools(self.__agent_tools)
        self.agent = self.prompt | self.llm_with_tools
                
    @debug_callable("method")  
    def add_context(self,data:List[str],table_name: str = "documents",RPC_function: str = "match_documents"):
        docs = turn_to_docs(data)
        if self.__vectore_store:
            ids = self.__vectore_store.add_to_vektore_store(
                docs=docs,
                RPC_function=RPC_function,
                table_name=table_name
            )
            if ids == None or len(ids) == 0:
                raise VektoreStoreError(f"Error! bei {self.name} wurden bei der 'add_context' methode nichts in den Vektorestore hinzugefügt! ")
            return f"die docs wurden erfolgreich hinzugefügt, hier die ids:{ids}"   
        else:
            self.__vectore_store = AIVectoreStore(
                docs=docs,
                RPC_function=RPC_function,
                table_name=table_name
            )
            retriever = self.__vectore_store.as_retriever()
            stuff_chain = create_stuff_documents_chain(
                llm=self.llm_with_tools,
                prompt=self.prompt,
            )
            retrieval_chain = create_retrieval_chain(
                combine_docs_chain=stuff_chain,
                retriever=retriever
            )
            self.retrieval_chain = retrieval_chain
            return self
        
    @debug_callable("method")
    def invoke(self,invoked_dict:I) -> K:
        if "context" not in invoked_dict and not self.retrieval_chain:
            invoked_dict["context"] = []
        agent = self.retrieval_chain or self.agent
        ai_respo = agent.invoke(invoked_dict)
        if "tool_calls" not in ai_respo.additional_kwargs:
            return ai_respo.content
        if not ai_respo:
            raise AINoResponeError(f"Error! der Onecall Agent: {self.name} hat beim invoke nichts returned")
        tool_name = ai_respo.additional_kwargs["tool_calls"][0]["function"]["name"]
        called_tool_arr = list(filter(lambda tool:tool.name == tool_name,self.__agent_tools))
        if len(called_tool_arr) == 0:
            raise AIToolCallError(f"Error! das tool was in 'onecall_agent':{self.name} gerufen wurde gibt es garnicht bei seinen Tools!")
        called_tool:AgentTool = called_tool_arr[0]
        called_args = ai_respo.additional_kwargs["tool_calls"][0]["function"]["arguments"]
        if called_args != 'null':
            called_args_dict = json.loads(called_args)
            parsed_args = called_tool.input_schema(**called_args_dict) # input_schema ist ja ein pydantic model welches dicts validieren und zu einem pydantic_instanz verwandeln kann, weil der arg_schema ein dict ist, nehmen wir das auf und formen das in das arg_schema unserer func um
            result = called_tool.func(**parsed_args.model_dump()) # was wir dann machen ist die func von unserem tool aufzurufen mit den validierten args die wir dann als dict entpacken und als paramter unserer func geben, somit haben wir k1 = v1, k2 = v2, k3 = v3, usw...
        else:
            result = called_tool.func()  
        respo = self.architect.structure(result)
        return respo
    
    def __rawInvoke__(self,invoked_dict:I):
        if "context" not in invoked_dict and not self.retrieval_chain:
            invoked_dict["context"] = []
        agent = self.retrieval_chain or self.agent
        ai_respo = agent.invoke(invoked_dict)
        return ai_respo
            
class MetaAgents():
    
    @staticmethod
    def CurserAgent():
        class PromptInvokeSchema(BaseInvokeSchema):
            cursor_tools:List[str]
        class PromptOutputSchema(BaseOutputSchema):
            question:str = Field(description="hier kannst du nach mehr infos fragen vom user die er vielleicht noch nennen sollte damit du einen besseren prompt machst. Wenn du keine hast, returnst du hier None ")
            has_question:bool = Field(description="hier sagst du ob du eine Frage gestellt hast oder nicht")
        class CursorPrompter():
            def __init__(self):   
                self.agent = LLMChain[PromptInvokeSchema,PromptOutputSchema](
                    name = f"CursorPrompter",
                    description = "ein cursor-spezialisierter prompt-writer für perfekte cursor-actions ",
                    output_structure = BaseOutputSchema,
                    prompt = [
                        ("system", '''
                            Du bist ein hochprofessioneller Prompt-Engineer für Cursor. 
                            Deine Aufgabe: Aus jeder Benutzeranfrage einen **klaren, cursor-kompatiblen Prompt** erstellen, der:

                            1. Direkt verständlich für die LLM-Engine von Cursor ist.
                            2. Den Kontext, die Tools (z.B. Shadcn, Framer-Motion, eigene Agent-Libs) und die gewünschten Dateien korrekt berücksichtigt.
                            3. Präzise Anweisungen gibt, damit Cursor genau das erzeugt, was der Benutzer will.
                            4. Keine unnötigen Informationen enthält, nur klar strukturiert und ausführbar ist.

                            Erstelle die prompts in einer schritt-für-schritt anleitungs-style wenn nötig, um cursor den perfekten plan zu geben wir er den wunsch des users erfüllt.
                            Mache den prompt so detaliert und strukturiert wie möglich um cursor den besten prompt zu geben damit er absolut nach dem wunsch des users handelt

                            mach ihn wirklich super duper detaliert, so das cursor nur das richtige machen kann

                            Jede Benutzeranfrage kann:
                            - Eine neue Aufgabe sein
                            - Eine Anpassung oder Korrektur einer vorherigen Aufgabe sein
                            - Ein spezielles Tool oder eine Designvorgabe enthalten

                            Antwort immer **nur mit dem fertigen Prompt**, der direkt an Cursor gegeben werden kann. Keine Erklärungen oder zusätzliche Texte.
                            '''),
                        ("system","das hier sind die Tools und MCP server auf die cursor zugriff hat: {cursor_tools}"),
                        ("system","das hier sind die extra infos nach denen du gefragt hattest:{extra_infos}")
                    ]
                )
            
            def write(self,invoked_dict:PromptInvokeSchema) -> BaseOutputSchema:
                invoked_dict["extra_infos"] = []
                while True:
                    respo = self.agent.invoke(invoked_dict)
                    if not respo.has_question:
                        break
                    else:
                        extra_infos = input(respo.question)
                        invoked_dict["extra_infos"].append(extra_infos)
                        respo = self.agent.invoke(invoked_dict)
                return respo.content
            
        cursor_prompter = CursorPrompter()
        return cursor_prompter
    
    @staticmethod
    def DecisionMaker():
        class DeciderOutputSchema(BaseModel):
            decistion:bool = Field(description="hier kommt deine Finale entscheidung ob die aussage auf 'True' oder 'False' führt")
            confidence:int = Field(description="von einer Skala von 1-100, wie sicher bist du dir bei deiner Entscheidung? notiere das hier")
            reasons:List[str] = Field(description="hier schreibst du 2-3 kurze gründe auf, wieso du deine decision auf True oder False entschieden hast")
            
        class DeciderInvokeSchema(BaseInvokeSchema):
            reference:Any
            
        class DecisionMaker():
            def __init__(self):
                self.agent = LLMChain[DeciderInvokeSchema,DeciderOutputSchema](
                    name = f"Decider",
                    description = "Ein agent welches darauf spezialisert ist, nach frage des users zu bestimmen ob es auf den referenz-punkt zu trifft oder nicht",
                    output_structure = DeciderOutputSchema,
                    prompt = [
                        ("system", """
                            Du bist ein Analyse-Agent, der anhand eines gegebenen Referenz-Textes eine binäre Entscheidung trifft.

                            Deine Aufgabe:
                            - Analysiere den übergebenen Referenz-Text: {reference}.
                            - Triff eine finale Entscheidung, ob die Fragestellung oder Behauptung auf 'True' oder 'False' hinausläuft.
                            - Sei immer eindeutig (kein "vielleicht" oder "unklar").

                            Output-Struktur:
                            - decision: True oder False
                            - confidence: Zahl von 1–100, wie sicher du dir bist
                            - reasons: 2–3 kurze, klare Gründe für deine Entscheidung

                            Wichtige Regeln:
                            - Richte deine Entscheidung ausschließlich auf die Inhalte im Referenz-Text.
                            - Wenn der Referenz-Text mehrdeutig ist, entscheide dich nach der stärksten Evidenz.
                            - Keine Ausschweifungen, keine Nebensätze – nur die angeforderte Struktur.
                            """)
                    ]
                )
                
            def decide(self,invoked_dict:DeciderInvokeSchema) -> DeciderOutputSchema:
                respo = self.agent.invoke(invoked_dict)
                return respo
            
        decider = DecisionMaker()
        return decider
    

