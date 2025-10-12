#Global-Errors
class NoneResponse(Exception):
    ''' Der Error der auftritt, wenn etwas mit 'None' antwortet '''
    ...

class InvalidStructure(Exception):
    ''' Ein Error der geworfen wird, wenn etwas der angegebenen Struktur nicht entspricht '''   
    ...
    
class InvalidInput(InvalidStructure):
    ''' Dieser Error wird geworfen wenn einer in jeglichem Context keinen validen Input eingibt '''
    ...
    
class InvalidOutput(InvalidStructure):
    ''' Dieser Error wird geworfen, wenn in jeglichem kontext kein valider output genriert wird (kann man schön mit if isInstance() abchecken) '''
    ...
    
class IgnoredLiterals(InvalidInput):
    ''' Dieser Error wird geworfen wenn beim input welcher durch bestimmte literals vordefiniert ist, diese ignoriert '''
    ...
    
class AlreadyExists(Exception):
    ''' Wirft den error wenn etwas was schon exestiert nochmal erstellt wird '''

#AI-Errors
class AIError(Exception):
    ''' das ist der Basic Error aller AI-relevanten dingen, wie chains,llms oder agenten'''
    ...

class LLMChainError(AIError):
    ''' Expliziter Error bei LLMChains '''
    ...
    
class OneCallAgentError(AIError):
    ''' Expliziter Error bei OneCallAgents '''
    ...
    
class ReActAgentError(AIError):
    ''' Expliziter Error bei ReActAgents '''
    ...
    
class AINoResponeError(AIError):
    ''' Ein error der nur kommt, wenn die AI nichts antwortet '''
    ...
    
class AIInvalidOutputError(AIError):
    ''' Ein Error der kommt, wenn die AI nicht nach dem vorgegebenen output-strukture antwortet '''
    ...
    
class AIInvalidInputError(AIError):
    ''' Ein Error der kommt, wenn du als dev nicht entsprechend deiner Inputstruktur functions oder methoden callst '''
    ...
    
class AIToolCallError(AIError):
    ''' Ein Error der kommt, wenn die AI Probleme mit dem Tool-Callen hat '''
    ...


#DataBank-Errors       
class DB_Error(Exception):
    ''' das ist der Basic Error aller Memory relevanten dingen, wie Supabasetables, Vectorestores oder ChatHistorys'''
    ...
    
class SupabaseTableError(DB_Error):
    ''' Error der 'Basic' SupabaseTables '''
    ...
    
class ChatHistoryError(SupabaseTableError):
    ''' Error der ChatHistorys '''
    ...
    
class VektoreStoreError(DB_Error):
    ''' Error bei VektoreStores '''
    ...
    
class TableNameNotFound(DB_Error):
    ''' Error wenn bei table_name übergabe es garkein table mit diesem namen gibt '''
    ...
    
class ColumnNotFound(DB_Error):
    ''' Error wenn ein eingegebener col nicht gefunden wird '''
    ...
    
class EmptyDBResponse(DB_Error,NoneResponse):
    ''' wenn ein return einer DB leer ist '''
    ...
    