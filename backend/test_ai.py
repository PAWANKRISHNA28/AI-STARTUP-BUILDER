import requests

def test_suggestions():
    print("Testing startup suggestions...")
    try:
        r = requests.post("http://127.0.0.1:8000/api/v1/ai/startup-suggestions", json={"prompt": "gym"})
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text}")
    except Exception as e:
        print(e)

test_suggestions()
