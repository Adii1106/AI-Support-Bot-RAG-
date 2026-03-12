"use client";

import ChatWidget from '@/components/ChatWidget';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 font-sans text-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          AI Customer Support Prototype
        </h1>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          This is the sample "Customer Facing" page. The floating chat widget in the bottom right corner represents how this tool would be embedded on a real company website.
        </p>

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
