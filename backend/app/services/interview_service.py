import json
from google import genai
from google.genai import types

from app.core.config import settings

# Initialize Gemini Client
client = genai.Client(api_key=settings.GEMINI_API_KEY)

async def generate_interview_questions(parsed_resume: dict, job_description: str | None = None) -> list:
    """
    Generate 5 highly tailored technical and behavioral interview questions based on the resume.
    """
    resume_json = json.dumps(parsed_resume, indent=2)
    
    context = f"Here is the candidate's resume data:\n\n{resume_json}\n\n"
    if job_description:
        context += f"The candidate is applying for a role with this job description:\n\n{job_description}\n\n"
        
    system_instruction = (
        "You are an expert technical recruiter and hiring manager. "
        "Analyze the candidate's resume and generate 5 highly tailored interview questions to test their skills and experience. "
        "Include a mix of behavioral and technical questions based strictly on the resume. "
        "For each question, provide a 'hint' that suggests how the candidate should structure their answer "
        "or what specific experiences from their resume they should highlight.\n\n"
        "Return the response ONLY as a JSON array of objects, where each object has 'question' and 'hint' string properties."
    )
    
    try:
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=context,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7,
                response_mime_type="application/json"
            )
        )
        
        # Parse the JSON response
        raw_text = response.text.strip()
        questions = json.loads(raw_text)
        return questions
    except Exception as e:
        print(f"Failed to generate interview questions: {e}")
        # Return fallback questions
        return [
            {
                "question": "Can you walk me through your most recent project listed on your resume?",
                "hint": "Focus on your specific contributions and the impact it had on the business."
            }
        ]
