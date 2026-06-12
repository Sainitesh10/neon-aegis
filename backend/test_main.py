import sqlite3
from fastapi.testclient import TestClient
from main import app, init_db

client = TestClient(app)

def test_honeypot_initial_trap():
    # Ensure the database is initialized
    init_db()
    
    # Clear out the test IP just in case
    conn = sqlite3.connect("aegis.db")
    conn.execute("DELETE FROM banned_ips WHERE ip = 'testclient'")
    conn.commit()
    conn.close()

    # Hit the honeypot for the first time
    response = client.get("/api/v1/secure/admin-portal?payload=SELECT * FROM users")
    assert response.status_code == 403
    assert "Your IP has been logged and banned" in response.json()["error"]

def test_honeypot_already_banned():
    # The second time the same IP hits the trap, it should be rejected immediately
    response = client.get("/api/v1/secure/admin-portal")
    assert response.status_code == 403
    assert "You have been banned" in response.json()["error"]
