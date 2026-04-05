import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';

export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'Photo URL required' }, { status: 400 });
    }

    try {
      await del(url);
    } catch (blobError) {
      console.warn('Blob deletion failed (may be external URL):', blobError);
    }

    return NextResponse.json({ success: true, message: 'Photo deleted' });
  } catch (error) {
    console.error('Photo delete failed:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
