# Neon Aegis: AI-Powered Intrusion Prevention System 🛡️

Neon Aegis is a full-stack cybersecurity application that utilizes **Deception Technology** (honeypots) and **Google Gemini AI** to actively trap, analyze, and automatically ban malicious bots attempting to scan or compromise a web application.

It features a sleek, real-time Glassmorphism dashboard built with Next.js and Framer Motion that allows you to watch incoming attacks get intercepted and analyzed by AI in real-time.

## Features
- **Active Honeypot Trap**: Invisible endpoints that act as bait for automated scanners and malicious scripts.
- **Instant IP Banning**: A fast Python FastAPI backend that instantly blacklists malicious IPs in a SQLite database upon trap activation.
- **AI Threat Analysis**: Integrates with Google Gemini 2.5 Flash to automatically analyze the intercepted payloads (like SQL Injection) and explain the attacker's intent in plain English.
- **Real-Time Telemetry**: Uses Server-Sent Events (SSE) to stream live threat data to the frontend dashboard without polling.
- **Premium UI/UX**: A gorgeous, animated Glassmorphism dashboard built with Next.js, TailwindCSS, and Framer Motion.

## Technology Stack
- **Frontend**: Next.js, React, TailwindCSS, Framer Motion
- **Backend**: Python, FastAPI, SQLite, Uvicorn
- **AI Integration**: Google Gemini API (`requests`)

## How to Run

### 1. Start the Backend (Intrusion Detection System)
Open a terminal and run the FastAPI server:
```bash
cd backend
python -m venv venv
# On Windows: .\venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate
pip install fastapi uvicorn requests
uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend (Threat Dashboard)
Open a second terminal and run the Next.js app:
```bash
npm install
npm run dev
```
Navigate to `http://localhost:3000/dashboard` to view the live threat feed.

### 3. Run a Simulated Attack
To test the honeypot, open a third terminal and run the provided simulation script:
```bash
python backend/hacker_attack.py
```
You will immediately see the dashboard light up, the alarm sound, and the AI analysis appear on screen. The attacker's IP will be permanently banned from making future requests.
