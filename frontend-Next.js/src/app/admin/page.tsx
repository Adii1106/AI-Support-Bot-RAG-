"use client";

import { useState, useEffect } from 'react';
import InteractiveCanvas from '@/components/InteractiveCanvas';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  BarChart3, 
  AlertCircle, 
  ThumbsUp, 
  HelpCircle, 
  Database, 
  ArrowLeft,
  Settings,
  Shield,
  Activity,
  Trash2
} from 'lucide-react';

export default function AdminDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'upload' | 'analytics'>('upload');
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setIsLoadingDocs(true);
      setFetchError(null);
      const res = await fetch(`/api/documents?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setDocuments(data.documents || []);
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to fetch");
      }
    } catch (err: any) {
      console.error("Failed to fetch documents", err);
      setFetchError(err.message);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('idle');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setUploadStatus('success');
        setFile(null);
        setTimeout(() => {
          fetchDocuments();
          alert("🎉 Document trained successfully!\n\nYou can now return to the Home page and ask the chat widget questions about this document.");
        }, 500);
      } else {
        setUploadStatus('error');
      }
    } catch (err) {
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#09090b] text-[#f4f4f5] font-sans grid-backdrop relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/5 blur-[130px] rounded-full pointer-events-none z-0" />

      {/* Background Interactive Connected Nodes */}
      <InteractiveCanvas />

      {/* Sidebar Desktop */}
      <div className="w-68 bg-[#121215]/80 border-r border-white/5 backdrop-blur-xl relative z-10 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/5">
          <div className="font-extrabold text-lg tracking-tighter flex items-center gap-2 text-white">
            <div className="w-4 h-4 bg-indigo-600 rounded-sm rotate-45 shadow-md shadow-indigo-500/50"></div>
            <span>Workspace<span className="text-indigo-400">Admin</span></span>
          </div>
          <div className="mt-4 flex items-center space-x-2 bg-indigo-500/5 border border-indigo-500/10 px-3 py-1.5 rounded-lg w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 glow-pulse"></div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Pipeline Active</span>
          </div>
        </div>
        
        <div className="p-4 space-y-1.5 flex-grow">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 select-none">
            Core Engine
          </div>
          <button 
            onClick={() => setActiveTab('upload')}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-semibold text-xs uppercase tracking-wider cursor-pointer ${activeTab === 'upload' ? 'bg-indigo-600 border border-indigo-500 text-white shadow-lg shadow-indigo-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <Database className="w-4 h-4 mr-3" />
            Knowledge Base
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-semibold text-xs uppercase tracking-wider cursor-pointer ${activeTab === 'analytics' ? 'bg-indigo-600 border border-indigo-500 text-white shadow-lg shadow-indigo-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <BarChart3 className="w-4 h-4 mr-3" />
            System Analytics
          </button>
          
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mt-8 mb-2 select-none">
            Settings
          </div>
          <button className="w-full flex items-center px-4 py-3 rounded-xl text-slate-500 hover:text-slate-400 text-xs font-semibold uppercase tracking-wider cursor-not-allowed">
            <Shield className="w-4 h-4 mr-3" /> API Credentials
          </button>
          <button className="w-full flex items-center px-4 py-3 rounded-xl text-slate-500 hover:text-slate-400 text-xs font-semibold uppercase tracking-wider cursor-not-allowed">
            <Settings className="w-4 h-4 mr-3" /> Parameters
          </button>
        </div>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <a 
            href="/" 
            className="w-full flex items-center justify-center px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl spring-transition active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chat
          </a>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-1 p-8 overflow-y-auto relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Mobile Navigation Header */}
          <header className="pb-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 md:hidden">
             <div className="flex items-center space-x-3">
               <a href="/" className="p-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl hover:bg-white/10 hover:text-white transition-all active:scale-90">
                 <ArrowLeft className="w-4 h-4" />
               </a>
               <h1 className="text-xl font-black text-white tracking-tight">Workspace Admin</h1>
             </div>
             <div className="flex space-x-1.5 border border-white/5 p-1 rounded-xl bg-black/40 backdrop-blur-md">
               <button 
                 onClick={() => setActiveTab('upload')} 
                 className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${activeTab === 'upload' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
               >
                 Upload
               </button>
               <button 
                 onClick={() => setActiveTab('analytics')} 
                 className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
               >
                 Stats
               </button>
             </div>
          </header>

          {activeTab === 'upload' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Manage Data Sources</h2>
                <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider font-semibold">Trained vector chunks loaded inside pgvector semantic context</p>
              </div>

              {/* Ingestion & Training Panel */}
              <div className="bg-[#121215]/80 border border-white/5 rounded-3xl p-6 shadow-xl backdrop-blur-md">
                <h3 className="text-sm font-bold tracking-tight text-white mb-4 flex items-center uppercase tracking-widest text-slate-300">
                  <FileText className="w-4 h-4 mr-2 text-indigo-400" />
                  Knowledge Base Loader (PDF/TXT)
                </h3>
  
                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center spring-transition ${file ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'}`}
                >
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                    <UploadCloud className="w-6 h-6 text-indigo-400 animate-pulse" />
                  </div>
                  {file ? (
                    <div className="space-y-1">
                      <p className="font-bold text-white text-sm">{file.name}</p>
                      <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">{(file.size / 1024 / 1024).toFixed(2)} MB • READY</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-slate-300 text-sm">Drag & Drop training file</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-wider">PDF or TXT up to 10MB</p>
                    </div>
                  )}

                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.txt"
                    onChange={(e) => e.target.files && setFile(e.target.files[0])}
                  />
                  <label
                    htmlFor="file-upload"
                    className="mt-5 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all select-none"
                  >
                    Select File
                  </label>
                </div>

                {file && (
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full mt-5 bg-indigo-600 border border-indigo-500 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center text-xs uppercase tracking-widest cursor-pointer shadow-lg shadow-indigo-500/10 active:scale-95"
                  >
                    {isUploading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Training Semantic Model...
                      </span>
                    ) : "Process & Train Bot"}
                  </button>
                )}

                {uploadStatus === 'success' && (
                  <div className="mt-4 p-4 bg-green-950/20 text-green-400 border border-green-500/20 rounded-xl text-xs font-semibold flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2.5 text-green-500" /> Vector space compiled and trained successfully!
                  </div>
                )}
                {uploadStatus === 'error' && (
                  <div className="mt-4 p-4 bg-red-950/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2.5 text-red-500" /> Error occurred during RAG pipeline chunk ingestion.
                  </div>
                )}

                {/* Active Trained Files List */}
                <div className="mt-8 pt-8 border-t border-white/5">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Currently Loaded Index Space</h4>
                  
                  {isLoadingDocs ? (
                    <div className="flex justify-center p-6">
                      <div className="animate-spin h-5 w-5 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
                    </div>
                  ) : fetchError ? (
                    <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-6 text-center text-xs text-red-400">
                      <AlertCircle className="w-5 h-5 mx-auto mb-2 text-red-400" />
                      <strong>Operational Error:</strong> {fetchError}
                      <p className="mt-1 text-slate-500">Ensure the FastAPI reload service is active and NEXT_PUBLIC_SUPABASE_URL variables are accurate.</p>
                      <button onClick={fetchDocuments} className="mt-4 text-xs font-bold underline text-indigo-400 cursor-pointer">Retry Connection</button>
                    </div>
                  ) : documents.length === 0 ? (
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 text-center text-xs text-slate-500 select-none uppercase font-bold tracking-wider">
                      Zero files trained in vector space. Use loader above.
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-[450px] overflow-y-auto pr-1">
                      {documents.map((doc, idx) => (
                        <div key={doc.id || idx} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 hover:bg-white/[0.03] transition-all shadow-sm">
                          <div className="flex items-center justify-between p-4">
                            <div className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-1 flex-shrink-0" />
                              <div className="overflow-hidden">
                                <p className="font-bold text-white text-xs truncate max-w-[200px] sm:max-w-md" title={doc.title}>{doc.title}</p>
                                <p className="text-[8px] uppercase tracking-wider font-bold text-slate-500 mt-1">
                                  INGESTED: {new Date(doc.created_at).toLocaleDateString()} • {new Date(doc.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                              </div>
                            </div>
                            <button 
                              onClick={() => setExpandedDocId(expandedDocId === doc.id ? null : doc.id)}
                              className={`px-3.5 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${expandedDocId === doc.id ? 'bg-indigo-600 text-white' : 'bg-white/5 text-indigo-400 hover:bg-white/10'}`}
                            >
                              {expandedDocId === doc.id ? 'Close' : 'Summary'}
                            </button>
                          </div>
                          
                          {expandedDocId === doc.id && (
                            <div className="px-5 pb-5 pt-1 bg-black/10 border-t border-white/5">
                              <div className="flex items-center mb-2 mt-3">
                                <HelpCircle className="w-3.5 h-3.5 text-indigo-400 mr-2" />
                                <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Semantic Overview</h5>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed italic bg-black/20 p-4 rounded-xl border border-white/5">
                                "{doc.summary || 'Summary unavailable.'}"
                              </p>
                              <div className="mt-4 flex gap-2">
                                <span className="px-2 py-1 bg-white/5 text-slate-400 rounded-md text-[8px] font-bold uppercase tracking-wider">pgvector-384</span>
                                <span className="px-2 py-1 bg-white/5 text-slate-400 rounded-md text-[8px] font-bold uppercase tracking-wider">llama-3.1 verified</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-5 border-t border-white/5 flex justify-between items-center text-xs select-none">
                  <span className="flex items-center text-slate-400 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl font-bold uppercase text-[9px] tracking-wider">
                    <FileText className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {documents.length} File{documents.length !== 1 ? 's' : ''} Active
                  </span>
                  <button
                    onClick={async () => {
                      if (confirm('Permanently wipe document vectors?')) {
                        await fetch('/api/upload/clear', { method: 'DELETE' });
                        fetchDocuments();
                        alert('Database and cached overview wiped.');
                      }
                    }}
                    className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-red-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Wipe Database
                  </button>
                </div>
              </div>

              {/* Structured RAG Feature Preview */}
              <div className="bg-gradient-to-r from-indigo-950/20 to-indigo-900/10 text-white rounded-3xl p-6 border border-indigo-500/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-indigo-600/30 border border-indigo-500/20 text-indigo-300 text-[8px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest select-none">Feature Preview</span>
                </div>
                <h2 className="text-base font-bold mb-1 tracking-tight flex items-center uppercase tracking-widest text-indigo-300">
                  <Activity className="w-4 h-4 mr-2 text-indigo-400" />
                  Structured Dataset Analytics (SQL agent)
                </h2>
                <p className="text-slate-400 text-xs mb-5 max-w-xl leading-relaxed">
                  Soon, upload CSV tables (e.g., tickets, analytics records). The agent dynamically creates query embeddings, maps relations, and constructs analytical tables on the fly.
                </p>
                
                <div className="border border-white/5 bg-black/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-40 cursor-not-allowed select-none">
                  <UploadCloud className="w-5 h-5 text-slate-500 mb-2" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">CSV Data Dropper</p>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-4 text-amber-400 text-xs font-semibold flex items-start select-none">
                <AlertCircle className="w-4 h-4 mr-2.5 flex-shrink-0 mt-0.5 text-amber-400" />
                <p><strong>Telemetry Warning:</strong> These parameters are currently loaded from prototype telemetry data for vector verification. Live Supabase database hooks are currently processing.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#121215]/80 p-5 rounded-2xl border border-white/5 shadow-sm flex flex-col justify-between hover:border-white/10 transition-all select-none">
                  <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center justify-between">
                    Total Queries
                    <span className="text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded text-[8px] font-bold">+12%</span>
                  </div>
                  <div className="text-2xl font-black text-white mt-3">1,248</div>
                </div>
                <div className="bg-[#121215]/80 p-5 rounded-2xl border border-white/5 shadow-sm flex flex-col justify-between hover:border-white/10 transition-all select-none">
                  <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center justify-between">
                    Cosine Accuracy
                    <ThumbsUp className="w-3.5 h-3.5 text-green-500" />
                  </div>
                  <div className="text-2xl font-black text-white mt-3">92%</div>
                </div>
                <div className="bg-[#121215]/80 p-5 rounded-2xl border border-white/5 shadow-sm flex flex-col justify-between hover:border-white/10 transition-all select-none">
                  <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center justify-between">
                    Refused (Guard)
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="text-2xl font-black text-white mt-3">24</div>
                </div>
              </div>

              <div className="bg-[#121215]/80 rounded-2xl border border-white/5 shadow-sm overflow-hidden select-none">
                <div className="px-6 py-4 border-b border-white/5 bg-white/[0.01]">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Semantic Hits Frequency</h3>
                </div>
                <div className="divide-y divide-white/5">
                  {[
                    { q: "What is your refund policy for opened items?", count: 142 },
                    { q: "How long does standard shipping take to California?", count: 89 },
                    { q: "Do you offer international warranty?", count: 56 },
                  ].map((item, i) => (
                    <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                      <div className="flex items-center text-slate-300">
                        <HelpCircle className="w-4 h-4 mr-3 text-slate-500" />
                        <span className="font-semibold text-xs">{item.q}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg">{item.count} hits</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#121215]/80 rounded-2xl border border-white/5 shadow-sm overflow-hidden border-l-2 border-l-amber-500 select-none">
                <div className="px-6 py-4 border-b border-white/5 bg-amber-500/[0.02] flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Vector Search Gaps</h3>
                  <span className="text-[8px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded uppercase tracking-wider">Refusal Triggers</span>
                </div>
                <div className="divide-y divide-white/5">
                  {[
                    { q: "Does the device support 220V outlets?", count: 6 },
                    { q: "Can I use multiple promo codes?", count: 4 },
                  ].map((item, i) => (
                    <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.01]">
                      <span className="font-semibold text-xs text-slate-300">{item.q}</span>
                      <button className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 cursor-pointer" onClick={() => setActiveTab('upload')}>Supply Docs</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
