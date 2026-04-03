import { NextResponse } from 'next/server';

export async function GET() {
  const backendUrl = (process.env.BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

  try {
    const response = await fetch(`${backendUrl}/documents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Python backend error');
    
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Proxy Error (/documents):', error);
    return NextResponse.json(
      { error: `Connection Failed: ${error.message}` },
      { status: 502 }
    );
  }
}
