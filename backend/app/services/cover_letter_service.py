import json
from google import genai
from google.genai import types

from app.core.config import settings

# Initialize Gemini Client
client = genai.Client(api_key=settings.GEMINI_API_KEY)

async def generate_cover_letter(parsed_resume: dict, company_name: str | None = None, job_description: str | None = None) -> str:
    """
    Generate a professional cover letter based on the resume and optional job details.
    """
    resume_json = json.dumps(parsed_resume, indent=2)
    
    context = f"Here is the candidate's resume data:\n\n{resume_json}\n\n"
    if company_name:
        context += f"The candidate is applying to a company named: {company_name}\n\n"
    if job_description:
        context += f"The target job description is:\n\n{job_description}\n\n"
        
    system_instruction = (
        "You are an expert career coach and professional copywriter. "
        "Write a highly engaging, professional, and tailored cover letter for the candidate based on their resume. "
        "If a company name and job description are provided, make sure to explicitly connect the candidate's skills to the requirements of the job. "
        "Do not invent any fictional skills or experiences; stick strictly to what is on the resume. "
        "Return ONLY the plain text of the cover letter. Do not include any JSON formatting, markdown blocks, or introductory text."
    )
    
    try:
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=context,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7
            )
        )
        return response.text.strip()
    except Exception as e:
        print(f"Failed to generate cover letter: {e}")
        return "Error: Could not generate cover letter at this time. Please try again."
