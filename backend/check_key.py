import requests

API_KEY = "AQ.Ab8RN6L8EorG9U1ArXueS_h8o56M6Xtu3ZH0rh2o3ehoKbvVPw"
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}"
response = requests.get(url)
print("Status Code:", response.status_code)
print("Response:", response.json())
