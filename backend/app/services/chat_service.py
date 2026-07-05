import json
from google import genai
from google.genai import types

from app.core.config import settings

# Initialize Gemini Client
client = genai.Client(api_key=settings.GEMINI_API_KEY)

async def chat_with_resume(parsed_resume: dict, message: str, history: list) -> str:
    """
    Chat with the AI using the resume as context.
    """
    resume_json = json.dumps(parsed_resume, indent=2)
    
    system_instruction = (
        "You are an expert career coach and AI Resume Assistant. "
        "The user has uploaded their resume. Here is the structured data parsed from it:\n\n"
        f"{resume_json}\n\n"
        "Answer the user's questions strictly based on the provided resume data. "
        "If they ask about something not on the resume, kindly inform them that it is not present in the document. "
        "Be conversational, encouraging, and helpful."
    )
    
    # Format history for google-genai
    formatted_history = []
    for msg in history:
        role = "model" if msg.get("role") == "assistant" else "user"
        content = msg.get("content", "")
        formatted_history.append(
            types.Content(role=role, parts=[types.Part.from_text(text=content)])
        )
        
    # Append the new message
    formatted_history.append(
        types.Content(role="user", parts=[types.Part.from_text(text=message)])
    )

    try:
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=formatted_history,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7,
            )
        )
        return response.text
    except Exception as e:
        return f"I'm sorry, I encountered an error connecting to the AI: {str(e)}"
