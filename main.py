from pb.agent_modules.fastapi_config import *
from writeEmail import router as write_router
from readEmail import router as read_router

app.include_router(read_router)
app.include_router(write_router)