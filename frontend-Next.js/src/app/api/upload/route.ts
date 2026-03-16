import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Just forward the file to our new Python AI backend
        const pythonFormData = new FormData();
        pythonFormData.append('file', file);

        const res = await fetch('http://localhost:8000/upload', {
            method: 'POST',
            body: pythonFormData,
        });

        const data = await res.json();
        
        if (!res.ok) throw new Error(data.detail || 'Python backend error');

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: error.message || 'Check if Python server is running on :8000' }, { status: 500 });
    }
}
