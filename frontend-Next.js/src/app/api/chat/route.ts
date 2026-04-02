import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, history = [] } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Call our Python AI backend
    let backendUrl = (process.env.BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
    
    console.log(`Talking to backend at: ${backendUrl}/chat`);

    try {
        const response = await fetch(`${backendUrl}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, history }),
            cache: 'no-store',
            signal: AbortSignal.timeout(8000) // 8 second timeout
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Backend Error (${response.status}): ${errorText}`);
        }

        const data = await response.json();

        // Wrap it in a stream-like response
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

    } catch (fetchError: any) {
        console.error('Fetch to Python failed:', fetchError);
        return NextResponse.json({ 
            error: `Vercel could not reach Hugging Face. Error: ${fetchError.message}`,
            url: `${backendUrl}/chat`
        }, { status: 502 });
    }

  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
