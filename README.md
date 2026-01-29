# TripIt.Ai 🌍✈️

**AI-Powered Travel Planning Platform**

TripIt.Ai uses LLMs (Groq) to generate personalized day-to-day travel itineraries based on budget, interests, and travel style.

## 🚀 Key Features

- **AI Itinerary Generation**: Custom trip plans with cost breakdown.
- **Contextual Chat Assistant**: Ask questions about destinations.
- **Trip Persistence**: Save and manage your itineraries (Supabase).
- **Interactive Map**: Visualize your route.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Framer Motion
- **Backend**: FastAPI (Python), Groq SDK
- **Database/Auth**: Supabase
- **Hosting**: Vercel (Frontend), Render/Railway (Backend)

## 📦 Setup & Installation

### Prerequisites
- Node.js 18+
- Python 3.10+
- Supabase Account
- Groq API Key

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/tripit-ai.git
cd tripit-ai
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

## 🔑 Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000/api/v1
```

### Backend (.env)
```env
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
```

## 📄 License
MIT
