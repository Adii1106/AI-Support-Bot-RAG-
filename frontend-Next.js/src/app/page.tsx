"use client";

import ChatWidget from '@/components/ChatWidget';
import { ArrowRight, Database, Bot, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-200">
      {/* Navbar Minimal */}
      <nav className="border-b border-slate-100 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
          <div className="w-5 h-5 bg-slate-900 rounded-sm"></div>
          AgenticSupport
        </div>
        <div className="text-sm font-medium text-slate-500 hidden sm:block">
          Enterprise RAG Prototype
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-xs font-semibold mb-8 tracking-wide border border-slate-200 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          SYSTEM LIVE
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
          Autonomous support, <br className="hidden sm:block" />
          <span className="text-slate-400">rooted in your truth.</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          A production-grade Agentic RAG architecture designed to eliminate hallucinations. Built natively on <strong>Next.js, FastAPI, Supabase, and Llama 3.3</strong>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/admin" className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 w-full sm:w-auto">
            Go to Admin Dashboard <ArrowRight className="w-4 h-4" />
          </a>
          <button
            className="px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-all focus:ring-4 focus:ring-slate-100 w-full sm:w-auto"
            onClick={() => {
              const widgetBtn = document.querySelector('.fixed.bottom-6.right-6 > button') as HTMLButtonElement;
              if (widgetBtn) widgetBtn.click();
            }}
          >
            Try Chat Widget
          </button>
        </div>

        {/* Feature Grid / Instructions */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-slate-100 pt-16">
          <div className="space-y-4">
            <div className="w-10 h-10 bg-slate-50 border border-slate-200 flex items-center justify-center rounded-lg text-slate-700 shadow-sm">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">1. Ingest Knowledge</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Navigate to the Admin Dashboard and securely upload your company manuals (PDF/TXT). The Python backend chunks and embeds the data into pgvector.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="w-10 h-10 bg-slate-50 border border-slate-200 flex items-center justify-center rounded-lg text-slate-700 shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">2. Query the Agent</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Open the chat widget in the bottom right corner (the "Customer" experience) and ask complex policy questions.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 bg-slate-50 border border-slate-200 flex items-center justify-center rounded-lg text-slate-700 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">3. Zero Hallucinations</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              The LLM evaluates the mathematically relevant context from the vector database. If the answer isn't in your docs, the bot explicitly refuses to guess.
            </p>
          </div>
        </div>

      </main>

      {/* Chat Widget injected at root */}
      <ChatWidget />
    </div>
  );
}
