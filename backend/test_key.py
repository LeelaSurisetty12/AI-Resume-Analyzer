import os
import google.generativeai as genai

# Using the exact key provided by the user
os.environ["GEMINI_API_KEY"] = "AQ.Ab8RN6L8EorG9U1ArXueS_h8o56M6Xtu3ZH0rh2o3ehoKbvVPw"
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

try:
    print("Testing API key by listing models...")
    models = list(genai.list_models())
    for m in models:
        print(m.name)
except Exception as e:
    print("Failed to list models!")
    print(str(e))
