import os
import io

# Fix HuggingFace tokenizers fork warning before any threading
os.environ["TOKENIZERS_PARALLELISM"] = "false"

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
from supabase import create_client, Client
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter
from pypdf import PdfReader
from groq import Groq
import asyncio
import time

# Load environment variables
load_dotenv()

app = FastAPI(title="AI Support RAG Backend")

# Enable CORS for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize clients securely (stripping hidden newlines/spaces)
# Adding fallbacks for different hosting platform naming (Vercel uses SUPABASE_URL often)
supabase_url = (os.getenv("NEXT_PUBLIC_SUPABASE_URL") or os.getenv("SUPABASE_URL") or "").strip()
supabase_key = (os.getenv("SUPABASE_SERVICE_ROLE_KEY") or "").strip()
groq_key = (os.getenv("GROQ_API_KEY") or "").strip()

supabase: Client = create_client(supabase_url, supabase_key)
groq = Groq(api_key=groq_key)

# Using a lightweight local model for embeddings 
model = SentenceTransformer('all-MiniLM-L6-v2')

# --- PERFORMANCE CACHE ---
# We store the document overviews in memory to avoid redundant Supabase selects on every chat.
KB_CACHE = {
    "overview": "",
    "updated_at": 0
}

async def refresh_kb_cache():
    """Reloads the Knowledge Base overview from Supabase into memory cache."""
    global KB_CACHE
    try:
        start_time = time.time()
        print("Refreshing KB Cache...")
        res = supabase.table("documents").select("title, summary").execute()
        
        overview = ""
        if res.data:
            overview = "CURRENT KNOWLEDGE BASE OVERVIEW:\n"
            for d in res.data:
                overview += f"- {d['title']}: {d.get('summary', 'Summary being processed...')}\n"
        
        KB_CACHE["overview"] = overview
        KB_CACHE["updated_at"] = time.time()
        print(f"KB Cache updated in {time.time() - start_time:.2f}s")
    except Exception as e:
        print(f"Cache Refresh Error: {e}")

@app.on_event("startup")
async def startup_event():
    """Start the cache refresh in the background so the server starts instantly."""
    asyncio.create_task(refresh_kb_cache())

async def generate_summary(text: str) -> str:
    """Generates a high-level summary of the document for global context."""
    try:
        # Take just the first 8000 characters to avoid exceeding context limits for the summary
        preview_text = text[:8000] 
        prompt = f"""Summarize the following document in about 150-200 words. 
Focus on the main purpose, key sections, and what kind of questions this document can answer.
Keep it professional and concise.

DOCUMENT TEXT:
{preview_text}
"""
        response = groq.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=300
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Summarization error: {e}")
        return "Summary unavailable."

class ChatRequest(BaseModel):
    prompt: str
    history: List[dict] = []

@app.get("/")
async def health_check():
    return {"status": "healthy", "engine": "python-fastapi"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text = ""
        
        # basic file extension check
        if file.filename.endswith(".pdf"):
            reader = PdfReader(io.BytesIO(content))
            for page in reader.pages:
                text += page.extract_text() + "\n"
        else:
            text = content.decode("utf-8")

        if not text.strip():
            raise HTTPException(status_code=400, detail="no text found in file")

        # split it into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50
        )
        chunks = text_splitter.split_text(text)

        # 1. Generate Global Summary
        print(f"Generating summary for {file.filename}...")
        doc_summary = await generate_summary(text)

        # 2. Insert the main document record
        doc_data = {
            "title": file.filename,
            "content": text,
            "summary": doc_summary, # New field
            "metadata": {"filename": file.filename, "source": "python-backend"}
        }
        res = supabase.table("documents").insert(doc_data).execute()
        document_id = res.data[0]["id"]

        # 3. Process chunks and generate embeddings
        chunk_records = []
        print(f"Processing {len(chunks)} chunks...")
        start_time = time.time()
        
        for chunk in chunks:
            # Python 3.8 Compatibility: use run_in_executor instead of to_thread
            loop = asyncio.get_event_loop()
            embedding = await loop.run_in_executor(None, model.encode, chunk)
            chunk_records.append({
                "document_id": document_id,
                "content": chunk,
                "embedding": embedding.tolist(),
                "metadata": {"parent_title": file.filename}
            })

        supabase.table("document_chunks").insert(chunk_records).execute()
        print(f"Chunks indexed in {time.time() - start_time:.2f}s")

        # Refresh cache now that a new doc is available
        await refresh_kb_cache()

        return {"success": True, "documentId": document_id, "chunks": len(chunks)}

    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        total_start = time.time()

        # 1. Generate query embedding (Async Thread)
        print(f"Query: {request.prompt[:50]}...")
        start = time.time()
        loop = asyncio.get_event_loop()
        embedding_vec = await loop.run_in_executor(None, model.encode, request.prompt)
        query_embedding = embedding_vec.tolist()
        print(f"[TIME] Embeddings: {time.time() - start:.2f}s")

        # 2. Search Supabase (Async Thread)
        start = time.time()
        rpc_params = {
            "query_embedding": query_embedding,
            "match_threshold": 0.3, 
            "match_count": 5
        }
        # Python 3.8 compatible async thread call
        search_res = await loop.run_in_executor(None, lambda: supabase.rpc("match_document_chunks", rpc_params).execute())
        chunks = search_res.data if search_res.data else []
        print(f"[TIME] DB Search: {time.time() - start:.2f}s")

        # 3. Using In-Memory Cache for summaries (No more redundant DB call!)
        has_docs = len(KB_CACHE["overview"]) > 0
        kb_overview = KB_CACHE["overview"]

        # 4. Hard Guardrail: Only refuse if the Knowledge Base is completely empty
        if not chunks and not has_docs:
            return {"text": "I'm sorry, but my Knowledge Base is currently empty. Please upload some documents in the Admin Panel so I can help you!"}

        # 5. Build context
        context = ""
        if chunks:
            context = "\n\n---\n\n".join([
                f"[Document: {c.get('metadata', {}).get('parent_title', 'unknown')}]\n{c['content']}"
                for c in chunks
            ])

        system_prompt = f"""You are a strict technical support AI. 

{kb_overview}

<CONTEXT>
{context if chunks else 'No specific fragments found for this query. Use the OVERVIEW above if relevant.'}
</CONTEXT>

RULES:
1. If the user asks for a summary or what information is available, use the 'CURRENT KNOWLEDGE BASE OVERVIEW' above.
2. If they ask a specific technical question, use the data inside <CONTEXT>.
3. If the answer is not in the Overview or the Context, say you don't know.
4. Do not use external knowledge.
"""

        # 6. Talk to Groq
        start = time.time()
        messages = [{"role": "system", "content": system_prompt}]
        messages.extend(request.history)
        messages.append({"role": "user", "content": request.prompt})

        completion = groq.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0,
            stream=False 
        )
        print(f"[TIME] Groq LLM: {time.time() - start:.2f}s")
        print(f"[TIME] Total Chat Request: {time.time() - total_start:.2f}s")

        return {"text": completion.choices[0].message.content}

    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents")
async def get_documents():
    try:
        # Returning summary as well so the frontend can display it
        # Python 3.8 compatible async thread call
        loop = asyncio.get_event_loop()
        res = await loop.run_in_executor(None, lambda: supabase.table("documents").select("id, title, created_at, summary").order("created_at", desc=True).execute())
        return {"success": True, "documents": res.data}
    except Exception as e:
        print(f"Fetch documents error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/clear")
async def clear_knowledge_base():
    try:
        # Delete all documents (cascade will handle chunks)
        supabase.table("documents").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
        # Reset cache
        global KB_CACHE
        KB_CACHE = {"overview": "", "updated_at": time.time()}
        return {"success": True, "message": "knowledge base wiped"}
    except Exception as e:
        print(f"Clear error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
