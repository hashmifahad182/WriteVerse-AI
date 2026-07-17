# AI Writer Copilot

A production-architected, RAG-powered AI writing assistant for stories, novels, blogs, and scripts — GitHub Copilot for writers.

## Stack

- **Frontend**: React + Vite + Tailwind CSS + React Router + Axios
- **Backend**: Node.js + Express (5-layer architecture: Controller → Service → AI Orchestration → RAG → Model)
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (access token in memory, refresh token in httpOnly cookie)
- **AI**: Google Gemini (generation + embeddings)
- **Vector Store**: Custom FAISS-style cosine-similarity store, file-persisted per story (see `backend/src/rag/faissStore.service.js` for the production swap-in path to real FAISS/Pinecone/Qdrant)

## Getting Started

### Backend
```bash
cd backend
cp .env.example .env   # fill in MONGO_URI, JWT secrets, GEMINI_API_KEY
npm install
npm run dev             # http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env    # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev              # http://localhost:5173
```

## What's implemented

- Auth (register/login/logout/refresh) with bcrypt + JWT
- Story, Chapter, Character, Timeline, PromptHistory, ChatHistory MongoDB schemas
- Notion-style contentEditable editor with auto-save
- All 16 AI features from the spec: Continue Writing, Rewrite, Improve, Expand, Shorten, Change Tone, Generate Dialogue, Chapter Generation, Timeline Tracking, Plot Suggestions, AI Chat, Story/Chapter Summaries, Translate, Title Generator, Cover Prompt Generator, Character Memory
- Hybrid RAG: vector similarity (FAISS-style store) for semantic recall + direct MongoDB reads for hard consistency constraints (character status, timeline)
- Post-generation consistency checker (flags dead/gone characters reappearing)
- Prompt templates fully separated from business logic (`backend/src/ai/prompts/templates/`)
- Rate limiting (general + stricter AI-endpoint limits), Helmet, CORS, Mongo sanitization, centralized error handling, Winston logging, PromptHistory cost/latency tracking

## Deployment

- **Frontend** → Vercel (`vercel.json` not included by default; Vite's default build output in `dist/` deploys as-is)
- **Backend** → Render (Node web service; ensure `FAISS_STORAGE_DIR` points to a persistent disk if you want the vector index to survive restarts — Render's free tier has an ephemeral filesystem, so for production use a managed vector DB instead, per the swap-in notes in `faissStore.service.js`)
- **Database** → MongoDB Atlas

## Folder Structure

See the architecture doc in the original design conversation, or browse `backend/src/` and `frontend/src/` — both mirror the 5-layer / feature-grouped structure described there.
