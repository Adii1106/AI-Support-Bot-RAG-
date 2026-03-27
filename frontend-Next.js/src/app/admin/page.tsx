"use client";

import { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, BarChart3, AlertCircle, ThumbsUp, HelpCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
          alert("🎉 Document trained successfully!\n\nYou can now return to the Home page and ask the chat widget questions about this document.");
        }, 100);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* basically the dashboard header */}
        <header className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">AI Support Admin</h1>
            <p className="text-slate-500 mt-1">manage docs and see what people are asking.</p>
          </div>
          <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-2 px-4 flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-600">Online</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Knowledge Base */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-500" />
                Knowledge Base
              </h2>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors ${file ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
              >
                <div className="p-3 bg-indigo-100 rounded-full mb-4">
                  <UploadCloud className="w-6 h-6 text-indigo-600" />
                </div>
                {file ? (
                  <div className="space-y-1">
                    <p className="font-medium text-slate-800">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-slate-700">Drag & Drop document</p>
                    <p className="text-sm text-slate-500 mt-1">PDF or TXT up to 10MB</p>
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
                  className="mt-4 px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  Browse Files
                </label>
              </div>

              {file && (
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center"
                >
                  {isUploading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Processing Vectors...
                    </span>
                  ) : "Process & Train Bot"}
                </button>
              )}

              {uploadStatus === 'success' && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" /> Document trained successfully!
                </div>
              )}
              {uploadStatus === 'error' && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" /> Error processing document.
                </div>
              )}

              {/* danger zone - for quick debugging */}
              <div className="mt-12 pt-6 border-t border-slate-100">
                <button
                  onClick={async () => {
                    if (confirm('Wipe everything?')) {
                      await fetch('/api/upload/clear', { method: 'DELETE' });
                      alert('Done. DB is clean.');
                    }
                  }}
                  className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                >
                  Reset Knowledge Base
                </button>
              </div>
            </div>
          </div>

          {/* dummy analytics for the demo */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* New Data Analysis Upcoming Feature Block */}
            <div className="bg-indigo-900 text-white rounded-2xl p-6 shadow-sm border border-indigo-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Upcoming Feature</span>
              </div>
              <h2 className="text-xl font-bold mb-2 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-indigo-300" />
                Data Analysis Agent (Structured RAG)
              </h2>
              <p className="text-indigo-200 mb-6 text-sm">
                Soon, you will be able to upload CSV files (like customer support tickets or sales data). The AI will dynamically generate SQL queries to answer analytical questions about your datasets.
              </p>
              
              <div className="border-2 border-dashed border-indigo-700 bg-indigo-800/50 rounded-xl p-6 flex flex-col items-center justify-center text-center opacity-70 cursor-not-allowed">
                <div className="p-3 bg-indigo-800 rounded-full mb-3">
                  <UploadCloud className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="font-medium text-indigo-100">Upload CSV Dataset (Coming Soon)</p>
                  <p className="text-sm text-indigo-300 mt-1">.csv files only</p>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold flex items-center pt-4">
              <BarChart3 className="w-5 h-5 mr-2 text-slate-500" />
              Widget Analytics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="text-slate-500 text-sm font-medium flex items-center justify-between">
                  Total Queries
                  <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full text-xs">+12%</span>
                </div>
                <div className="text-3xl font-bold text-slate-800 mt-2">1,248</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="text-slate-500 text-sm font-medium flex items-center justify-between">
                  User Satisfaction
                  <ThumbsUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mt-2">92%</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="text-slate-500 text-sm font-medium flex items-center justify-between">
                  Unanswered
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mt-2">24</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-semibold text-slate-800">Most Frequently Asked</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  { q: "What is your refund policy for opened items?", count: 142 },
                  { q: "How long does standard shipping take to California?", count: 89 },
                  { q: "Do you offer international warranty?", count: 56 },
                ].map((item, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center text-slate-700">
                      <HelpCircle className="w-4 h-4 mr-3 text-slate-400" />
                      <span className="font-medium text-sm">{item.q}</span>
                    </div>
                    <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{item.count} queries</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden border-l-4 border-l-amber-500">
              <div className="px-6 py-4 border-b border-slate-100 bg-amber-50/30 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Unanswered Queries (Doc Gaps)</h3>
                <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">todo</span>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  { q: "Does the device support 220V outlets?", count: 6 },
                  { q: "Can I use multiple promo codes?", count: 4 },
                ].map((item, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between">
                    <span className="font-medium text-sm text-slate-700">{item.q}</span>
                    {/* just an alert for now instead of full redirect */}
                    <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800" onClick={() => alert('WIP: go to upload')}>Upload Doc</button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div >
  );
}
