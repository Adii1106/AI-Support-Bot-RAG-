'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, RotateCw } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll whenever messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isStreaming]);

    const handleClear = () => {
        setMessages([]);
        setInput('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: input,
                    history: messages
                }),
            });

            if (!response.ok) throw new Error('API down');

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader');

            setIsLoading(false);
            setIsStreaming(true);

            let assistantContent = "";
            setMessages((prev) => [...prev, { role: 'assistant', content: "" }]);

            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataLine = line.slice(6);
                        if (dataLine === '[DONE]') continue;
                        try {
                            const parsed = JSON.parse(dataLine);
                            if (parsed.text) {
                                assistantContent += parsed.text;
                                setMessages((prev) => {
                                    const next = [...prev];
                                    next[next.length - 1] = {
                                        ...next[next.length - 1],
                                        content: assistantContent
                                    };
                                    return next;
                                });
                            }
                        } catch (e) { /* partial json */ }
                    }
                }
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [...prev, { role: 'assistant', content: "Oops, my brain is offline. Make sure the Python server is running on port 8000!" }]);
        } finally {
            setIsLoading(false);
            setIsStreaming(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans antialiased text-slate-900">
            {/* The actual chat window */}
            {isOpen && (
                <div className="bg-white bottom-20 right-0 fixed sm:absolute w-[calc(100vw-3rem)] sm:w-[420px] h-[600px] max-h-[calc(100vh-8rem)] rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    
                    {/* Header with clear button */}
                    <header className="p-5 bg-indigo-600 text-white flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white/10 rounded-xl">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold tracking-tight">AI Support</h3>
                                <div className="flex items-center text-xs opacity-80">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse" />
                                    Online
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1">
                            <button onClick={handleClear} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Clear Chat">
                                <RotateCw className="w-5 h-5" />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </header>

                    {/* Chat history section */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 px-4">
                                <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-500">
                                    <Bot className="w-8 h-8" />
                                </div>
                                <h4 className="font-bold text-slate-800">Hello there!</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Ask me anything about our services. I've been trained on the latest documentation.
                                </p>
                            </div>
                        )}

                        {messages.map((m, i) => (
                            <div key={i} className={cn("flex flex-col", m.role === 'user' ? "items-end" : "items-start")}>
                                <div className={cn(
                                    "max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm break-words",
                                    m.role === 'user' 
                                        ? "bg-indigo-600 text-white rounded-tr-none" 
                                        : "bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none"
                                )}>
                                    {m.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex items-start space-x-2">
                                <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* input area */}
                    <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100">
                        <div className="relative group">
                            <input
                                autoFocus
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your question..."
                                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 items-center justify-center transition-all p-4 pr-14 rounded-2xl text-sm outline-none placeholder:text-slate-400 disabled:opacity-50"
                                disabled={isLoading || isStreaming}
                            />
                            <button 
                                type="submit" 
                                disabled={!input.trim() || isLoading || isStreaming}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-30 transition-all active:scale-95"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-slate-400 mt-3 font-medium uppercase tracking-widest">
                            Built with Llama 3 & RAG
                        </p>
                    </form>
                </div>
            )}

            {/* The toggle button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-5 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-300 hover:bg-indigo-700 hover:scale-110 active:scale-95 transition-all duration-300 group"
                >
                    <MessageSquare className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                </button>
            )}
        </div>
    );
}
