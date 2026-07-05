import google.generativeai as genai
import os

genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "AQ.Ab8RN6L8EorG9U1ArXueS_h8o56M6Xtu3ZH0rh2o3ehoKbvVPw"))

try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"Error: {e}")
