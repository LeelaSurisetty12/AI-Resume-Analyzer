import json
from google import genai
from google.genai import types
from typing import Dict, Any

from app.core.config import settings

# Initialize Gemini Client
client = genai.Client(api_key=settings.GEMINI_API_KEY)

async def analyze_resume_with_ai(parsed_resume: dict, job_description: str = None) -> Dict[str, Any]:
    """
    Sends the parsed resume and optional job description to Gemini to get an ATS score and feedback.
    Forces JSON output.
    """
    
    prompt = f"""
    You are an expert ATS (Applicant Tracking System) and Technical Recruiter.
    I am providing you with a candidate's parsed resume data.
    
    Candidate Resume:
    {json.dumps(parsed_resume, indent=2)}
    """
    
    if job_description:
        prompt += f"""
        \nJob Description:
        {job_description}
        \nPlease analyze the resume SPECIFICALLY against this job description.
        """
    else:
        prompt += "\n\nPlease analyze this resume for general software engineering/tech roles."

    prompt += """
    Output your analysis EXACTLY as a raw JSON object with no markdown formatting or code blocks.
    The JSON object must have exactly these keys:
    {
        "ats_score": <integer from 0 to 100 based on fit>,
        "matched_skills": [<array of strings of skills present in both resume and JD, or just good skills>],
        "missing_skills": [<array of strings of skills missing from resume based on JD or standard expectations>],
        "improvement_suggestions": [<array of strings containing actionable feedback to improve the resume>]
    }
    """

    try:
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.2,
            )
        )
        
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        return json.loads(raw_text.strip())
    except Exception as e:
        # Fallback if AI fails (e.g. invalid API key, model not found)
        return {
            "ats_score": 0,
            "matched_skills": [],
            "missing_skills": ["Invalid API Key"],
            "improvement_suggestions": [f"Error connecting to AI: {str(e)}"]
        }
