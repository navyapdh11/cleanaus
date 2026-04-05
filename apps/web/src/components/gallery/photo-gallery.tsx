'use client';

import { useState, useCallback, useMemo } from 'react';
import { LazyImage } from './lazy-image';
import { cn, formatFileSize, formatDate } from '@/lib/utils';
import {
  Trash2,
  Download,
  Expand,
  X,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Search,
  Filter,
  ImageIcon,
  Loader2,
} from 'lucide-react';

export interface GalleryPhoto {
  id: string;
  url: string;
  thumbnailUrl?: string;
  filename?: string;
  altText?: string;
  size?: number;
  width?: number;
  height?: number;
  contentType?: string;
  category?: string;
  uploadedAt: string;
}

interface PhotoGalleryProps {
  photos: GalleryPhoto[];
  onDelete?: (photoId: string, photoUrl: string) => Promise<void>;
  onDownload?: (photo: GalleryPhoto) => void;
  isLoading?: boolean;
  className?: string;
}

export function PhotoGallery({
  photos,
  onDelete,
  onDownload,
  isLoading,
  className,
}: PhotoGalleryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const categories = useMemo(() => {
    const cats = new Set(photos.map((p) => p.category).filter((c): c is string => Boolean(c)));
    return ['all', ...Array.from(cats)];
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const matchesSearch =
        !searchQuery ||
        photo.altText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || photo.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [photos, searchQuery, selectedCategory]);

  const handleDelete = useCallback(
    async (photo: GalleryPhoto) => {
      if (!onDelete) return;
      if (!confirm(`Delete "${photo.altText || photo.filename || 'this photo'}"?`)) return;

      setDeletingIds((prev) => new Set(prev).add(photo.id));
      try {
        await onDelete(photo.id, photo.url);
      } catch (error) {
        console.error('Failed to delete photo:', error);
        alert('Failed to delete photo');
      } finally {
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(photo.id);
          return next;
        });
      }
    },
    [onDelete]
  );

  const handleDownload = useCallback(
    (photo: GalleryPhoto) => {
      if (onDownload) {
        onDownload(photo);
      } else {
        const a = document.createElement('a');
        a.href = photo.url;
        a.download = photo.filename || 'photo.jpg';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    },
    [onDownload]
  );

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const navigateLightbox = useCallback(
    (direction: -1 | 1) => {
      if (lightboxIndex === null) return;
      const newIndex =
        (lightboxIndex + direction + filteredPhotos.length) % filteredPhotos.length;
      setLightboxIndex(newIndex);
    },
    [lightboxIndex, filteredPhotos.length]
  );

  // Keyboard navigation for lightbox
  useState(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ImageIcon className="h-16 w-16 text-gray-300 dark:text-gray-600" />
        <h3 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
          No photos yet
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Upload some photos to get started
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:w-64"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-8 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''}
          </span>
          <div className="ml-2 flex rounded-lg border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'rounded-l-lg p-2 transition-colors',
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
              aria-label="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'rounded-r-lg p-2 transition-colors',
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <button
                onClick={() => openLightbox(index)}
                className="block aspect-square w-full cursor-pointer"
              >
                <LazyImage
                  src={photo.url}
                  alt={photo.altText || photo.filename || 'Gallery photo'}
                  thumbnailSrc={photo.thumbnailUrl}
                  className="h-full w-full"
                />
              </button>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/50" />

              {/* Action buttons on hover */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => openLightbox(index)}
                  className="rounded-full bg-white/90 p-2 text-gray-700 shadow-lg transition-transform hover:scale-110"
                  aria-label="Expand"
                >
                  <Expand className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDownload(photo)}
                  className="rounded-full bg-white/90 p-2 text-gray-700 shadow-lg transition-transform hover:scale-110"
                  aria-label="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
                {onDelete && (
                  <button
                    onClick={() => handleDelete(photo)}
                    disabled={deletingIds.has(photo.id)}
                    className="rounded-full bg-white/90 p-2 text-red-600 shadow-lg transition-transform hover:scale-110 disabled:opacity-50"
                    aria-label="Delete"
                  >
                    {deletingIds.has(photo.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>

              {/* Category badge */}
              {photo.category && (
                <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                  {photo.category}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750"
            >
              <button
                onClick={() => openLightbox(filteredPhotos.indexOf(photo))}
                className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg"
              >
                <LazyImage
                  src={photo.url}
                  alt={photo.altText || photo.filename || 'Gallery photo'}
                  thumbnailSrc={photo.thumbnailUrl}
                  className="h-full w-full"
                />
              </button>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900 dark:text-white">
                  {photo.altText || photo.filename || 'Untitled'}
                </p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                  {photo.size && <span>{formatFileSize(photo.size)}</span>}
                  {photo.contentType && <span>{photo.contentType}</span>}
                  <span>{formatDate(photo.uploadedAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleDownload(photo)}
                  className="rounded-lg border border-gray-300 bg-white p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  aria-label="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
                {onDelete && (
                  <button
                    onClick={() => handleDelete(photo)}
                    disabled={deletingIds.has(photo.id)}
                    className="rounded-lg border border-red-200 bg-white p-2 text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-gray-800 dark:hover:bg-red-900/20 disabled:opacity-50"
                    aria-label="Delete"
                  >
                    {deletingIds.has(photo.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation */}
          {filteredPhotos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox(-1);
                }}
                className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox(1);
                }}
                className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Image */}
          <div
            className="relative max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredPhotos[lightboxIndex].url}
              alt={
                filteredPhotos[lightboxIndex].altText ||
                filteredPhotos[lightboxIndex].filename ||
                'Gallery photo'
              }
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />

            {/* Info bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-sm text-white/90">
                {filteredPhotos[lightboxIndex].altText ||
                  filteredPhotos[lightboxIndex].filename ||
                  'Untitled'}
              </p>
              <p className="text-xs text-white/60">
                {lightboxIndex + 1} / {filteredPhotos.length}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(filteredPhotos[lightboxIndex]);
              }}
              className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Download className="mr-1 inline h-4 w-4" />
              Download
            </button>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(filteredPhotos[lightboxIndex]);
                  if (deletingIds.size === 0) {
                    closeLightbox();
                  }
                }}
                disabled={deletingIds.has(filteredPhotos[lightboxIndex].id)}
                className="rounded-lg bg-red-600/80 px-3 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                <Trash2 className="mr-1 inline h-4 w-4" />
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
