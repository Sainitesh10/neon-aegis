# Neon Aegis: Enterprise AI Intrusion Prevention System 🛡️

Neon Aegis is a full-stack cybersecurity application that utilizes **Deception Technology** (honeypots) and **Google Gemini AI** to actively trap, analyze, and automatically ban malicious bots attempting to scan or compromise a web application.

It features a sleek, real-time Glassmorphism dashboard built with Next.js and Framer Motion. This project has been upgraded to an **Enterprise Architecture** featuring Docker containerization, automated Pytest suites, and a GitHub Actions CI/CD pipeline.

## Features
- **Active Honeypot Trap**: Invisible endpoints that act as bait for automated scanners and malicious scripts.
- **Instant IP Banning**: A fast Python FastAPI backend that instantly blacklists malicious IPs in a SQLite database upon trap activation.
- **AI Threat Analysis**: Integrates with Google Gemini 2.5 Flash to automatically analyze the intercepted payloads (like SQL Injection) and explain the attacker's intent in plain English.
- **Real-Time Telemetry**: Uses Server-Sent Events (SSE) to stream live threat data to the frontend dashboard without polling.
- **Enterprise Architecture**: Fully Dockerized environments, automated unit testing (`pytest`), and Continuous Integration workflows.

## Technology Stack
- **Frontend**: Next.js, React, TailwindCSS, Framer Motion
- **Backend**: Python, FastAPI, SQLite, Uvicorn
- **AI Integration**: Google Gemini API
- **DevOps**: Docker, Docker Compose, GitHub Actions, Pytest

## How to Run (Docker)

The absolute easiest way to run the entire stack is using Docker. You do not need to install Python or Node.js.

1. Clone the repository and navigate into the folder.
2. Ensure Docker Desktop is installed and running.
3. Run the following command in your terminal:
```bash
docker-compose up -d --build
```
4. Navigate to `http://localhost:3000/dashboard` in your browser to view the live threat feed.

## Running Simulated Attacks
To test the honeypot in real-time and trigger the AI analysis, run the provided hacker simulation script:
```bash
python backend/hacker_attack.py
```
You will immediately see the dashboard light up, the alarm sound, and the AI analysis appear on screen.
