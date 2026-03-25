import { NextResponse } from 'next/server';

export async function DELETE() {
    try {
        let backendUrl = (process.env.BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');
        console.log(`Clearing DB at: ${backendUrl}/clear`);

        const res = await fetch(`${backendUrl}/clear`, {
            method: 'DELETE'
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Python backend error');

        return NextResponse.json(data);
    } catch (e: any) {
        console.error('delete error', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
