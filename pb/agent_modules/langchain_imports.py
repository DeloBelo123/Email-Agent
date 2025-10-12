#basic langchain imports
from langchain_openai import ChatOpenAI
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser,CommaSeparatedListOutputParser, JsonOutputParser, PydanticOutputParser
from pydantic import BaseModel,Field
from langchain_core.messages import HumanMessage,AIMessage,BaseMessage,ToolMessage,SystemMessage
from langchain_core.prompts import MessagesPlaceholder
from langchain_core.documents import Document
from langchain_groq import ChatGroq

#retriever imports
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_community.vectorstores.faiss import FAISS
from langchain.chains.history_aware_retriever import create_history_aware_retriever
from langchain.chains.retrieval import create_retrieval_chain
from langchain.tools.retriever import create_retriever_tool

#langchain-agent imports
from langchain.agents import create_tool_calling_agent,AgentExecutor
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain.tools import StructuredTool
from langchain_core.tools import tool

#langgraph-imports
from langgraph.graph import StateGraph,START,END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode

#typing imports
from typing import TypedDict as TD,List,Union,Any,Optional,TypeVar,Generic,Type,Literal,Callable,Tuple,Iterable,cast,ParamSpec
from enum import Enum

#must have imports
from dotenv import load_dotenv
import asyncio
import httpx
import os

def turn_to_docs(iteratble:Iterable):
    docs = [Document(page_content=data) for data in iteratble]
    return docs



