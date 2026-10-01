import requests

def test_guest():
    print("Testing guest login...")
    try:
        r = requests.post("http://127.0.0.1:8000/api/v1/auth/guest", json={"device_id": "test-device-123"})
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text}")
    except Exception as e:
        print(e)

def test_register():
    print("\nTesting register...")
    try:
        r = requests.post("http://127.0.0.1:8000/api/v1/auth/register", json={
            "email": "testuser@example.com",
            "password": "Password123!",
            "full_name": "Test User"
        })
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text}")
    except Exception as e:
        print(e)

def test_login():
    print("\nTesting login...")
    try:
        r = requests.post("http://127.0.0.1:8000/api/v1/auth/login", json={
            "email": "testuser@example.com",
            "password": "Password123!"
        })
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text}")
    except Exception as e:
        print(e)

test_guest()
test_register()
test_login()
