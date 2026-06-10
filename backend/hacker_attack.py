import requests
import time

HONEYPOT_URL = "http://127.0.0.1:8000/api/v1/secure/admin-portal"

print("==============================================")
print("[NEON AEGIS HACKER SIMULATOR INITIATED]")
print("==============================================")
print("\n[Hacker] Scanning website for vulnerabilities...")
time.sleep(2)
print("[Hacker] Vulnerability found! Hidden admin portal discovered.")
time.sleep(1)
print("[Hacker] Launching Brute Force Attack...\n")

# Rapid requests
for i in range(1, 4):
    try:
        # We will append a common SQL Injection payload to the URL to give Gemini something to analyze
        sql_injection_payload = "?username=admin' OR '1'='1'--&password=password"
        response = requests.get(HONEYPOT_URL + sql_injection_payload)
        print(f"Attack {i}: Status Code {response.status_code}")
        print(f"   Response: {response.json().get('error', 'Unknown Error')}")
        
        if "banned" in response.text.lower():
            print("\n[CRITICAL FAILURE]: Access Denied. The IP has been banned by the Firewall!")
            print("Abort! Abort! Abort!")
            break
            
    except Exception as e:
        print(f"Error connecting: {e}")
        
    time.sleep(0.5)

print("\nSimulation ended.")
