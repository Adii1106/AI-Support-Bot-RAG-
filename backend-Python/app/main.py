import os
import io

# Fix HuggingFace tokenizers fork warning before any threading
os.environ["TOKENIZERS_PARALLELISM"] = "false"

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from supabase import create_client, Client
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter
from pypdf import PdfReader
from groq import Groq

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
supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "").strip()
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "").strip()
groq_key = os.getenv("GROQ_API_KEY", "").strip()

supabase: Client = create_client(supabase_url, supabase_key)
groq = Groq(api_key=groq_key)

# Using a lightweight local model for embeddings 
model = SentenceTransformer('all-MiniLM-L6-v2')

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

        # 1. Insert the main document record
        doc_data = {
            "title": file.filename,
            "content": text,
            "metadata": {"filename": file.filename, "source": "python-backend"}
        }
        res = supabase.table("documents").insert(doc_data).execute()
        document_id = res.data[0]["id"]

        # 2. Process chunks and generate embeddings
        chunk_records = []
        for chunk in chunks:
            # Generate embedding vector
            embedding = model.encode(chunk).tolist()
            chunk_records.append({
                "document_id": document_id,
                "content": chunk,
                "embedding": embedding,
                "metadata": {"parent_title": file.filename}
            })

        supabase.table("document_chunks").insert(chunk_records).execute()

        return {"success": True, "documentId": document_id, "chunks": len(chunks)}

    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        # 1. Generate query embedding
        query_embedding = model.encode(request.prompt).tolist()

        # 2. Search Supabase using the match_document_chunks RPC
        rpc_params = {
            "query_embedding": query_embedding,
            "match_threshold": 0.3, # Lowered threshold to pick up more context
            "match_count": 5
        }
        search_res = supabase.rpc("match_document_chunks", rpc_params).execute()
        chunks = search_res.data if search_res.data else []

        # 3. Hard Guardrail: If no info is found in DB, don't even talk to the LLM
        if not chunks:
            return {"text": "I'm sorry, but I cannot find any information about that in the current documentation."}

        # 4. Build context
        context = ""
        if chunks:
            context = "\n\n---\n\n".join([
                f"[Document: {c.get('metadata', {}).get('parent_title', 'unknown')}]\n{c['content']}"
                for c in chunks
            ])

        system_prompt = f"""You are a strict technical support AI. 
You answer questions ONLY using the information in the <CONTEXT> tags.
If the answer is not explicitly in the context, you must say you don't know.
Do not use any external knowledge.

<CONTEXT>
{context}
</CONTEXT>"""

        # 5. Talk to Groq
        messages = [{"role": "system", "content": system_prompt}]
        messages.extend(request.history)
        messages.append({"role": "user", "content": request.prompt})

        completion = groq.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0,
            stream=False # handling non-streaming first for simplicity
        )

        return {"text": completion.choices[0].message.content}

    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents")
async def get_documents():
    try:
        res = supabase.table("documents").select("id, title, created_at").order("created_at", desc=True).execute()
        return {"success": True, "documents": res.data}
    except Exception as e:
        print(f"Fetch documents error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/clear")
async def clear_knowledge_base():
    try:
        # Delete all documents (cascade will handle chunks)
        supabase.table("documents").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
        return {"success": True, "message": "knowledge base wiped"}
    except Exception as e:
        print(f"Clear error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
