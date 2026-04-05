import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const altText = formData.get('altText') as string | undefined;
    const category = formData.get('category') as string | undefined;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type. Only images allowed.' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // Sanitize filename - remove path traversal and special chars
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/\.{2,}/g, '.');
    const timestamp = Date.now();
    const filename = `cleanaus-gallery-${timestamp}-${sanitizedName.toLowerCase()}`;
    const path = category ? `gallery/${category}/${filename}` : `gallery/${filename}`;

    const blob = await put(path, file, {
      access: 'public',
      contentType: file.type,
      addRandomSuffix: false,
    });

    return NextResponse.json({
      success: true,
      photo: {
        id: `photo-${timestamp}`,
        url: blob.url,
        filename: blob.pathname,
        contentType: blob.contentType,
        size: file.size,
        altText: altText || '',
        category: category || 'general',
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Photo upload failed:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
