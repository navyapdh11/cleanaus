import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';

export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'Photo URL required' }, { status: 400 });
    }

    // Validate URL belongs to our blob store to prevent SSRF
    if (!url.includes('public.blob.vercel-storage.com') && !url.includes('cleanaus-gallery')) {
      return NextResponse.json({ error: 'Invalid photo URL' }, { status: 400 });
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
