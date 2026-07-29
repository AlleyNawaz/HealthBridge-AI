import { NextRequest, NextResponse } from 'next/server';
import { getAllConversationSessions, deleteConversationSession } from '@/lib/db';

export async function GET() {
  try {
    const sessions = getAllConversationSessions();
    return NextResponse.json({ sessions }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch conversation history' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const success = deleteConversationSession(id);
    return NextResponse.json({ success }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete session' }, { status: 500 });
  }
}
