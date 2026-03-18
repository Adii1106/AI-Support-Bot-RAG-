import { NextResponse } from 'next/server';

export async function DELETE() {
    try {
        const res = await fetch('http://localhost:8000/clear', {
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
