import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, history = [] } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Call our Python AI backend
    let backendUrl = (process.env.BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');
    
    console.log(`Talking to backend at: ${backendUrl}/chat`);

    const response = await fetch(`${backendUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, history }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.detail || 'Python server error');

    // For now, Python sends back the full text. 
    // We'll wrap it in a stream-like response so the frontend stays happy.
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text: data.text })}\n\n`));
        controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'AI Brain is offline. Is the Python server running on :8000?' }, { status: 500 });
  }
}
