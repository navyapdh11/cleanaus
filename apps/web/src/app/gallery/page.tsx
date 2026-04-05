'use client';

import { useState, useEffect, useCallback } from 'react';
import { PhotoGallery, type GalleryPhoto } from '@/components/gallery/photo-gallery';
import { PhotoUpload } from '@/components/gallery/photo-upload';
import { ImageEditor } from '@/components/gallery/image-editor';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import {
  Camera,
  Upload,
  ImagePlus,
  Loader2,
} from 'lucide-react';

// Demo photos - in production these would come from the API/database
const DEMO_PHOTOS: GalleryPhoto[] = [
  {
    id: 'demo-1',
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    altText: 'Professional cleaner sanitizing kitchen counter',
    size: 245760,
    width: 800,
    height: 600,
    contentType: 'image/jpeg',
    category: 'kitchen',
    uploadedAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'demo-2',
    url: 'https://images.unsplash.com/photo-1527515637462-cff94eebd21f?w=800&q=80',
    altText: 'Spotless modern living room after deep cleaning',
    size: 312000,
    width: 800,
    height: 533,
    contentType: 'image/jpeg',
    category: 'living',
    uploadedAt: '2026-04-01T11:00:00Z',
  },
  {
    id: 'demo-3',
    url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
    altText: 'Sparkling clean bathroom with marble finishes',
    size: 198000,
    width: 800,
    height: 600,
    contentType: 'image/jpeg',
    category: 'bathroom',
    uploadedAt: '2026-04-02T09:30:00Z',
  },
  {
    id: 'demo-4',
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    altText: 'Organized and clean home office space',
    size: 267000,
    width: 800,
    height: 600,
    contentType: 'image/jpeg',
    category: 'office',
    uploadedAt: '2026-04-02T14:00:00Z',
  },
  {
    id: 'demo-5',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    altText: 'Fresh and tidy bedroom with made bed',
    size: 223000,
    width: 800,
    height: 600,
    contentType: 'image/jpeg',
    category: 'bedroom',
    uploadedAt: '2026-04-03T08:00:00Z',
  },
  {
    id: 'demo-6',
    url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    altText: 'Clean modern kitchen with stainless steel appliances',
    size: 289000,
    width: 800,
    height: 600,
    contentType: 'image/jpeg',
    category: 'kitchen',
    uploadedAt: '2026-04-03T12:00:00Z',
  },
  {
    id: 'demo-7',
    url: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80',
    altText: 'Pristine commercial office after evening cleaning',
    size: 178000,
    width: 800,
    height: 533,
    contentType: 'image/jpeg',
    category: 'commercial',
    uploadedAt: '2026-04-03T18:00:00Z',
  },
  {
    id: 'demo-8',
    url: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80',
    altText: 'Bright and airy living room with clean windows',
    size: 334000,
    width: 800,
    height: 600,
    contentType: 'image/jpeg',
    category: 'living',
    uploadedAt: '2026-04-04T10:00:00Z',
  },
];

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(DEMO_PHOTOS);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery');

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = useCallback(async (photoId: string, photoUrl: string) => {
    try {
      const response = await fetch('/api/photos/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: photoUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }

      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch (error) {
      // For demo photos (external URLs), just remove from state
      console.warn('Delete failed for external URL, removing from state:', error);
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    }
  }, []);

  const handleUploadComplete = useCallback(
    async (uploadedPhotos: Array<{ id: string; url: string }>) => {
      const newPhotos: GalleryPhoto[] = uploadedPhotos.map((p) => ({
        id: p.id,
        url: p.url,
        altText: '',
        category: 'general',
        uploadedAt: new Date().toISOString(),
      }));

      setPhotos((prev) => [...newPhotos, ...prev]);
      setActiveTab('gallery');
    },
    []
  );

  const handleEditSave = useCallback(
    async (editedBlob: Blob, filename: string) => {
      if (!editingPhoto) return;

      // In production, upload the edited blob to Vercel Blob
      // For demo, we'll just update the URL
      const formData = new FormData();
      formData.append('file', editedBlob, filename);
      formData.append('category', editingPhoto.category || 'edited');

      try {
        const response = await fetch('/api/photos', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setPhotos((prev) =>
            prev.map((p) =>
              p.id === editingPhoto.id
                ? { ...p, url: data.photo.url, uploadedAt: new Date().toISOString() }
                : p
            )
          );
        }
      } catch (error) {
        console.error('Failed to save edited photo:', error);
        throw error;
      }

      setEditingPhoto(null);
    },
    [editingPhoto]
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Photo Gallery
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage and showcase your cleaning results
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex rounded-lg border border-gray-300 dark:border-gray-600">
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-2 rounded-l-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'gallery'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <ImagePlus className="h-4 w-4" />
                Gallery ({photos.length})
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex items-center gap-2 rounded-r-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'upload'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Upload className="h-4 w-4" />
                Upload
              </button>
            </div>
          </div>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 p-6 dark:from-primary-900/20 dark:to-accent-900/20">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-800">
                  <Camera className="h-6 w-6 text-primary-600 dark:text-primary-300" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Upload Cleaning Photos
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Share before/after photos of your cleaning work. Photos are automatically
                    optimized and stored securely.
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                      Drag & drop or browse to upload
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                      Supports PNG, JPG, GIF, WebP (max 10MB)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                      Upload up to 10 photos at once
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <PhotoUpload onUploadComplete={handleUploadComplete} />
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
              </div>
            ) : (
              <PhotoGallery
                photos={photos}
                onDelete={handleDelete}
                isLoading={isLoading}
              />
            )}
          </>
        )}
      </main>

      {/* Image Editor Modal */}
      {editingPhoto && (
        <ImageEditor
          imageUrl={editingPhoto.url}
          filename={editingPhoto.filename}
          onSave={handleEditSave}
          onClose={() => setEditingPhoto(null)}
        />
      )}

      <Footer />
    </div>
  );
}
