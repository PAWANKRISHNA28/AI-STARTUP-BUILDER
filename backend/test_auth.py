import requests

BASE_URL = "http://127.0.0.1:8000/api/v1/auth"

def test():
    try:
        print("Testing Guest Login...")
        res = requests.post(f"{BASE_URL}/guest", json={"device_id": "test_device_123"})
        if res.status_code != 200:
            print(f"Guest login failed: {res.status_code} {res.text}")
            return
        token = res.json()["access_token"]
        print("Guest Login OK")

        print("Testing /me...")
        res = requests.get(f"{BASE_URL}/me", headers={"Authorization": f"Bearer {token}"})
        if res.status_code != 200:
            print(f"/me failed: {res.status_code} {res.text}")
            return
        print("/me OK:", res.json()["email"])

        print("Testing Normal Register...")
        email = "test_normal@example.com"
        res = requests.post(f"{BASE_URL}/register", json={"email": email, "full_name": "Test", "password": "password123"})
        if res.status_code != 200 and "already exists" not in res.text:
            print(f"Register failed: {res.status_code} {res.text}")
            return
        print("Register OK")

        print("Testing Normal Login...")
        res = requests.post(f"{BASE_URL}/login", json={"email": email, "password": "password123"})
        if res.status_code != 200:
            print(f"Login failed: {res.status_code} {res.text}")
            return
        normal_token = res.json()["access_token"]
        print("Login OK")

        print("Testing Normal /me...")
        res = requests.get(f"{BASE_URL}/me", headers={"Authorization": f"Bearer {normal_token}"})
        if res.status_code != 200:
            print(f"Normal /me failed: {res.status_code} {res.text}")
            return
        print("Normal /me OK:", res.json()["email"])
        
        print("All tests passed!")
    except Exception as e:
        print(f"Connection Error: {e}")

test()
