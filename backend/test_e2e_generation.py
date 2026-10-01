import sys
import os
import requests
import time

def run_test():
    base_url = "http://127.0.0.1:8000/api/v1"
    
    # 1. Login/Register as Guest
    print("Logging in as guest...")
    resp = requests.post(f"{base_url}/auth/guest", json={"device_id": "test_device"})
    if resp.status_code != 200:
        print(f"Auth failed: {resp.text}")
        return
    token = resp.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Create Project
    print("Creating project...")
    proj_data = {
        "title": "AI Crop Disease Detection",
        "idea_description": "AI-powered crop disease detection for farmers",
        "industry": "AgriTech",
        "country": "US",
        "budget": "100k",
        "business_type": "B2B",
        "target_users": "Farmers",
        "tech_preference": "AI"
    }
    resp = requests.post(f"{base_url}/projects/", json=proj_data, headers=headers)
    if resp.status_code != 200:
        print(f"Create project failed: {resp.text}")
        return
    project_id = resp.json().get("id")
    print(f"Project created: {project_id}")
    
    # 3. Trigger generation
    print("Triggering generation...")
    resp = requests.post(f"{base_url}/startup/analyze", json={
        "project_id": project_id,
        "startup_idea": proj_data["idea_description"]
    }, headers=headers)
    if resp.status_code != 200:
        print(f"Trigger failed: {resp.text}")
        return
        
    # 4. Wait for status
    for _ in range(10):
        time.sleep(2)
        resp = requests.get(f"{base_url}/startup/status/{project_id}", headers=headers)
        status = resp.json().get("status")
        print(f"Status: {status}")
        if status in ["completed", "failed"]:
            break
            
    print(f"Final status: {status}")
    if status == "failed":
        print("Generation failed!")
    else:
        print("Generation succeeded!")
        bp = requests.get(f"{base_url}/startup/blueprint/{project_id}", headers=headers)
        print("Blueprint received")

if __name__ == "__main__":
    run_test()
