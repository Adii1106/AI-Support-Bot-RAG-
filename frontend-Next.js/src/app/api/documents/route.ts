import { NextResponse } from 'next/server';

export async function GET() {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.json({ error: 'BACKEND_URL is not configured' }, { status: 500 });
  }

  // Ensure url structure doesn't break due to trailing slashes
  const baseUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

  try {
    const response = await fetch(`${baseUrl}/documents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy Error (/documents):', error);
    return NextResponse.json(
      { error: 'Failed to connect to Python backend' },
      { status: 502 }
    );
  }
}
