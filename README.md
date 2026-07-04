<div align="center">

# 🚀 Resumly - AI Resume Analyzer

### AI-powered Resume Analysis, ATS Scoring, Resume Chat, Interview Preparation & Cover Letter Generation

<p>
An intelligent resume analysis platform that evaluates resumes using Google Gemini AI, provides ATS compatibility scores, personalized improvement suggestions, AI-powered resume chat, interview preparation, and tailored cover letter generation.
</p>

<br>

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)]()
[![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)]()
[![Firebase](https://img.shields.io/badge/Firebase-Authentication-orange?logo=firebase)]()
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)]()
[![Gemini](https://img.shields.io/badge/Google-Gemini_AI-blue?logo=google)]()
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite)]()
[![Vercel](https://img.shields.io/badge/Hosted_on-Vercel-black?logo=vercel)]()

</div>

---

# 🌐 Live Demo

👉 **Live Website**

(https://ai-resume-analyzer-1n9o.vercel.app/)

---

# 📌 Features

✅ Secure Firebase Authentication

✅ AI Resume Analysis

✅ ATS Compatibility Score

✅ Resume Improvement Suggestions

✅ Missing & Matched Skills Detection

✅ AI Resume Chat Assistant

✅ Personalized Interview Questions

✅ AI Cover Letter Generator

✅ Resume Upload (PDF/DOCX)

✅ Analysis History

✅ Modern Dashboard

---

# 🖼️ Application Preview

## Landing Page

<img src="ScreenShots/landingpage.png" width="100%">

---

## Login

<img src="ScreenShots/login.png" width="70%">

---

## Dashboard

<img src="ScreenShots/dashboard.png" width="100%">

---

## Resume Upload

<img src="ScreenShots/uploadresume.png" width="100%">

---

## ATS Analysis

<img src="ScreenShots/Analysisresult.png" width="100%">

---

## Resume Chat

<img src="ScreenShots/resumechat.png" width="100%">

---

## Interview Preparation

<img src="ScreenShots/interviewprep.png" width="100%">

---

## AI Cover Letter

<img src="ScreenShots/Coverletter.png" width="100%">

---

# ⚙️ Tech Stack

## Frontend

- React
- Vite
- React Router
- Context API
- CSS

## Backend

- FastAPI
- Python
- SQLite

## AI

- Google Gemini API

## Authentication

- Firebase Authentication

## Deployment

- Vercel

---

# 🧠 How It Works

```text
                User
                  │
                  ▼
          Upload Resume
                  │
                  ▼
         Resume Parser (FastAPI)
                  │
                  ▼
         Google Gemini AI
                  │
     ┌────────────┼─────────────┐
     ▼            ▼             ▼
 ATS Score   AI Feedback   Missing Skills
                  │
                  ▼
        Dashboard Visualization
                  │
      ┌───────────┼────────────┐
      ▼           ▼            ▼
 Resume Chat Interview Prep Cover Letter
```

---

# 📂 Project Structure

```text
AI-Resume-Analyzer
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
├── backend
│   ├── app
│   ├── tests
│   ├── uploaded_resumes
│   ├── requirements.txt
│   └── resume_analyzer.db
│
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/LeelaSurisetty12/AI-Resume-Analyzer.git
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

# 🔑 Environment Variables

## Frontend (.env)

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## Backend (.env)

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

---

# 🎯 Future Improvements

- PDF Report Download
- Resume Version Comparison
- Multi-language Resume Support
- Recruiter Dashboard
- Company-specific ATS Optimization
- AI Resume Templates
- Job Recommendation Engine

---

# 👩‍💻 Author

### Leela Prashanthi Surisetty

B.Tech CSE (AI & ML)

GitHub

https://github.com/LeelaSurisetty12

LinkedIn

(Add your LinkedIn URL)

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future improvements.

---

<div align="center">

### Built using React, FastAPI, Firebase & Google Gemini AI

</div>
