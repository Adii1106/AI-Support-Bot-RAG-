# AI Customer Support Widget (RAG)

A professional, two-tier AI Support Widget that uses Retrieval-Augmented Generation (RAG) to answer questions based on your own documentation.

## 🏗️ Project Architecture

- **`frontend-Next.js/`**: A modern UI built with Next.js 15, Tailwind CSS, and Lucide React. It proxies AI requests to the Python backend.
- **`backend-Python/`**: A high-performance FastAPI server that handles document parsing, vector embeddings (MiniLM), and semantic search via Supabase pgvector.

---

## 🚀 Getting Started

### 1. Database Setup
Ensure you have run the `supabase/schema.sql` in your Supabase SQL Editor to enable `pgvector` and the `match_document_chunks` search function.

### 2. Backend (AI Brain)
Navigate to the backend folder and start the FastAPI server:

```bash
cd backend-Python
# (Optional) Create a venv
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server (Port 8000)
uvicorn app.main:app --reload
```

### 3. Frontend (UI)
Navigate to the frontend folder and start the development server:

```bash
cd frontend-Next.js
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the widget in action!

---

## 🛠️ Tech Stack
- **Framework**: Next.js & FastAPI
- **Database**: Supabase (PostgreSQL + pgvector)
- **AI Models**: Llama 3.3 (via Groq) & all-MiniLM-L6-v2 (local)
- **Styling**: Tailwind CSS
