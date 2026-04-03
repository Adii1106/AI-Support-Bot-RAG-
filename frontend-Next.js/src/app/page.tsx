"use client";

import ChatWidget from '@/components/ChatWidget';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 font-sans text-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          AI Agentic Support System
        </h1>
        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
          A production-ready RAG architecture built with <strong>Next.js, FastAPI, Supabase (pgvector), and Llama 3.3</strong>.
        </p>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-3 hover:text-indigo-600 transition-colors">How to test this prototype:</h2>
          <ol className="list-decimal list-inside text-slate-600 space-y-3">
            <li>Go to the <strong>Admin Dashboard</strong> and upload a PDF/TXT file (e.g., a company manual).</li>
            <li>Wait for the backend to chunk, embed, and store the document in the vector database.</li>
            <li>Click <strong>Try the Chat Widget</strong> below to open the support window.</li>
            <li>Ask questions! The AI will answer exclusively based on your uploaded document to prevent hallucinations.</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/admin" className="px-6 py-3 bg-white border border-slate-200 hover:border-indigo-300 shadow-sm rounded-xl text-indigo-600 font-semibold transition-all">
            Go to Admin Dashboard
          </a>
          <button
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 shadow-md rounded-xl text-white font-semibold transition-all"
            onClick={() => {
              // Trigger a click on the chat widget button to open it
              // This is a bit hacky but works for the prototype demo
              const widgetBtn = document.querySelector('.fixed.bottom-6.right-6 > button') as HTMLButtonElement;
              if (widgetBtn) widgetBtn.click();
            }}
          >
            Try the Chat Widget
          </button>
        </div>
      </div>

      {/* Incorporate the widget */}
      <ChatWidget />
    </div>
  );
}
