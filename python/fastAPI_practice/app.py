from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

class Username(BaseModel):
    username: str

users_db = {
    "0001": "JJ",
    "0002": "Kie"
}

@app.get("/")
async def home_page():
    return "Landing page of a FastAPI app"

@app.get("/username/get/{user_id}")
async def get_username(user_id: str):
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")

    if user_id in users_db:
        return {"user_id": user_id, "username": users_db[user_id]}
    else:
        raise HTTPException(status_code=404, detail="User not found")

@app.post("/username/post/{user_id}")
async def post_username(user_id: str, username: Username):
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")

    if not username.username:
        raise HTTPException(status_code=400, detail="Username is required")

    if user_id in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    else:
        users_db[user_id] = username.username
        return {"user_id": user_id, "username": username.username}

@app.put("/username/put/{user_id}")
async def put_username(user_id: str, username: Username):
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")
    
    if not username.username:
        raise HTTPException(status_code=400, detail="Updated username is required")
    
    if user_id in users_db:
        users_db[user_id] = username.username
        return {"user_id": user_id, "username": username.username}
    else:
        raise HTTPException(status_code=404, detail="User not found")
    
@app.delete("/username/delete/{user_id}")
async def delete_username(user_id: str):
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")
    
    if user_id in users_db:
        del users_db[user_id]
        return {"Successfully deleted user": user_id}
    else:
        raise HTTPException(status_code=404, detail="User not found")

