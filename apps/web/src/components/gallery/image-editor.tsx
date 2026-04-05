'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Save,
  X,
  Undo2,
  ZoomIn,
  ZoomOut,
  Loader2,
} from 'lucide-react';

interface ImageEditorProps {
  imageUrl: string;
  filename?: string;
  onSave?: (editedBlob: Blob, filename: string) => Promise<void>;
  onClose: () => void;
  className?: string;
}

type TransformState = {
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  zoom: number;
};

export function ImageEditor({
  imageUrl,
  filename = 'image.jpg',
  onSave,
  onClose,
  className,
}: ImageEditorProps) {
  const [transform, setTransform] = useState<TransformState>({
    rotation: 0,
    flipH: false,
    flipV: false,
    zoom: 1,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const rotate = useCallback((degrees: number) => {
    setTransform((prev) => ({
      ...prev,
      rotation: (prev.rotation + degrees) % 360,
    }));
    setHasChanges(true);
  }, []);

  const flipHorizontal = useCallback(() => {
    setTransform((prev) => ({ ...prev, flipH: !prev.flipH }));
    setHasChanges(true);
  }, []);

  const flipVertical = useCallback(() => {
    setTransform((prev) => ({ ...prev, flipV: !prev.flipV }));
    setHasChanges(true);
  }, []);

  const zoomIn = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom + 0.1, 3),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom - 0.1, 0.5),
    }));
  }, []);

  const resetTransform = useCallback(() => {
    setTransform({
      rotation: 0,
      flipH: false,
      flipV: false,
      zoom: 1,
    });
    setHasChanges(false);
  }, []);

  const applyTransform = useCallback(async () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isRotated90 = transform.rotation % 180 !== 0;
    const width = isRotated90 ? image.height : image.width;
    const height = isRotated90 ? image.width : image.height;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    ctx.save();

    ctx.translate(width / 2, height / 2);
    ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);

    ctx.restore();

    return new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
        },
        'image/jpeg',
        0.9
      );
    });
  }, [transform]);

  const handleSave = useCallback(async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      const blob = await applyTransform();
      if (blob) {
        const editedFilename = `edited-${filename.replace(/\.[^.]+$/, '.jpg')}`;
        await onSave(blob, editedFilename);
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Failed to save image:', error);
      alert('Failed to save edited image');
    } finally {
      setIsSaving(false);
    }
  }, [onSave, applyTransform, filename]);

  const transformStyle = {
    transform: `rotate(${transform.rotation}deg) scaleX(${transform.flipH ? -1 : 1}) scaleY(${transform.flipV ? -1 : 1}) scale(${transform.zoom})`,
    transition: 'transform 0.3s ease',
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4',
        className
      )}
      onClick={onClose}
    >
      <div
        className="relative flex h-full max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white">
            Edit Image
          </h3>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <span className="text-sm text-amber-500">Unsaved changes</span>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-2 dark:border-gray-700">
          <button
            onClick={() => rotate(90)}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            title="Rotate 90°"
          >
            <RotateCw className="h-5 w-5" />
          </button>
          <button
            onClick={flipHorizontal}
            className={cn(
              'rounded-lg p-2 transition-colors',
              transform.flipH
                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
            )}
            title="Flip Horizontal"
          >
            <FlipHorizontal className="h-5 w-5" />
          </button>
          <button
            onClick={flipVertical}
            className={cn(
              'rounded-lg p-2 transition-colors',
              transform.flipV
                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
            )}
            title="Flip Vertical"
          >
            <FlipVertical className="h-5 w-5" />
          </button>

          <div className="mx-2 h-6 w-px bg-gray-300 dark:bg-gray-600" />

          <button
            onClick={zoomOut}
            disabled={transform.zoom <= 0.5}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            title="Zoom Out"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <span className="min-w-[3rem] text-center text-sm text-gray-600 dark:text-gray-400">
            {Math.round(transform.zoom * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={transform.zoom >= 3}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            title="Zoom In"
          >
            <ZoomIn className="h-5 w-5" />
          </button>

          <div className="mx-2 h-6 w-px bg-gray-300 dark:bg-gray-600" />

          <button
            onClick={resetTransform}
            disabled={!hasChanges}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            title="Reset"
          >
            <Undo2 className="h-5 w-5" />
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Canvas area */}
        <div className="relative flex-1 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <div className="flex h-full items-center justify-center p-8">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Editing"
              style={transformStyle}
              className="max-h-full max-w-full object-contain"
              onLoad={() => setImageLoaded(true)}
              crossOrigin="anonymous"
            />
          </div>

          {/* Hidden canvas for rendering */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Footer info */}
        <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Tip: Use the toolbar buttons to rotate, flip, and zoom the image. Click Save to apply changes.
        </div>
      </div>
    </div>
  );
}
