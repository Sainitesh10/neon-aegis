import asyncio
import sqlite3
import json
import os
import requests
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Neon Aegis Backend")

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SSE connected clients
clients = []

def init_db():
    conn = sqlite3.connect("aegis.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS banned_ips (
            ip TEXT PRIMARY KEY,
            timestamp TEXT
        )
    """)
    conn.commit()
    conn.close()

def is_banned(ip: str) -> bool:
    conn = sqlite3.connect("aegis.db")
    cursor = conn.cursor()
    cursor.execute("SELECT 1 FROM banned_ips WHERE ip = ?", (ip,))
    result = cursor.fetchone()
    conn.close()
    return result is not None

def ban_ip(ip: str):
    conn = sqlite3.connect("aegis.db")
    cursor = conn.cursor()
    cursor.execute("INSERT OR IGNORE INTO banned_ips (ip, timestamp) VALUES (?, ?)", (ip, datetime.now().isoformat()))
    conn.commit()
    conn.close()

async def analyze_threat(payload: str) -> str:
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
        prompt = f"""
        You are an elite cybersecurity analyzer for an Intrusion Detection System. 
        A hacker has just sent the following payload to our honeypot endpoint:
        "{payload}"
        
        Classify this attack (e.g., SQL Injection, Cross-Site Scripting, Directory Traversal, Bot Crawl).
        Explain exactly what the hacker was trying to achieve in 1 or 2 concise, plain English sentences.
        """
        data = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        response = requests.post(url, json=data)
        response_json = response.json()
        return response_json["candidates"][0]["content"]["parts"][0]["text"].strip()
    except Exception as e:
        return "AI Analysis Failed: Could not determine attack vector."

@app.on_event("startup")
def startup():
    init_db()

@app.get("/api/v1/secure/admin-portal")
async def honeypot_trap(request: Request):
    client_ip = request.client.host
    
    if is_banned(client_ip):
        return JSONResponse(status_code=403, content={"error": "Access Denied. You have been banned by Neon Aegis."})
    
    # TRAP TRIGGERED!
    ban_ip(client_ip)
    
    # Extract malicious payload (query params)
    query_params = str(request.query_params)
    payload_used = query_params if query_params else "Standard Bot Crawl"
    
    # Analyze with Gemini
    ai_analysis = await analyze_threat(payload_used)
    
    # Broadcast event to dashboard
    event_data = {
        "type": "ATTACK_DETECTED",
        "ip": client_ip,
        "endpoint": f"/api/v1/secure/admin-portal?{query_params}",
        "payload": payload_used,
        "ai_analysis": ai_analysis,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    for queue in clients:
        await queue.put(event_data)
        
    return JSONResponse(status_code=403, content={"error": "Access Denied. Your IP has been logged and banned."})

@app.get("/api/events")
async def sse_stream(request: Request):
    queue = asyncio.Queue()
    clients.append(queue)
    
    async def event_generator():
        try:
            while True:
                # Wait for a new event
                event = await queue.get()
                yield f"data: {json.dumps(event)}\n\n"
        except asyncio.CancelledError:
            clients.remove(queue)
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
