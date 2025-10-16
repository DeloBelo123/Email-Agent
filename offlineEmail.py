from fastapi import APIRouter
from dataModels import AccessObjekt
from pb.supabase_tables import user_tabelle
from readEmail import redis,celery

router = APIRouter()

@router.post("/handle_user_status/test3")
def handle_status(access_objekt:AccessObjekt):
    user_id = access_objekt.user.id
    result = user_tabelle.select(
        columns=["OnOff"],
        where=[{"column":"user_id","is_":user_id}]
    )
    users_onoff_status = result[0]["OnOff"] if result and len(result) > 0 else "off"
    if users_onoff_status == "on":
        task_ids = redis.smembers(f"pending_auto_responses:{user_id}")
        for task_id in task_ids:
            celery.control.revoke(task_id.decode(),terminate=True)
        redis.delete(f"pending_auto_responses:{user_id}")
        return {"status": 200, "action": "online", "cancelled": len(task_ids)}
    else:
        return {"status": 200, "action": "offline"}