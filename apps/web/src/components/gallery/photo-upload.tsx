'use client';

import { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn, formatFileSize } from '@/lib/utils';
import {
  Upload,
  X,
  Check,
  AlertCircle,
  Loader2,
  ImagePlus,
} from 'lucide-react';

interface UploadProgress {
  fileId: string;
  fileName: string;
  size: number;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  url?: string;
}

interface PhotoUploadProps {
  onUploadComplete?: (photos: Array<{ id: string; url: string }>) => void;
  category?: string;
  className?: string;
  maxFiles?: number;
  maxSizeMB?: number;
}

export function PhotoUpload({
  onUploadComplete,
  category = 'general',
  className,
  maxFiles = 10,
  maxSizeMB = 10,
}: PhotoUploadProps) {
  const [uploads, setUploads] = useState<Map<string, UploadProgress>>(new Map());
  const [isDragging, setIsDragging] = useState(false);
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const filesToUpload = acceptedFiles.slice(0, maxFiles);

      for (const file of filesToUpload) {
        const fileId = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const abortController = new AbortController();
        abortControllersRef.current.set(fileId, abortController);

        setUploads((prev) =>
          new Map(prev).set(fileId, {
            fileId,
            fileName: file.name,
            size: file.size,
            progress: 0,
            status: 'uploading',
          })
        );

        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('category', category);
          formData.append('altText', file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));

          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setUploads((prev) => {
                const next = new Map(prev);
                const existing = next.get(fileId);
                if (existing) {
                  next.set(fileId, { ...existing, progress });
                }
                return next;
              });
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                setUploads((prev) => {
                  const next = new Map(prev);
                  const existing = next.get(fileId);
                  if (existing) {
                    next.set(fileId, {
                      ...existing,
                      progress: 100,
                      status: 'completed',
                      url: response.photo?.url,
                    });
                  }
                  return next;
                });
              } catch {
                setUploads((prev) => {
                  const next = new Map(prev);
                  const existing = next.get(fileId);
                  if (existing) {
                    next.set(fileId, {
                      ...existing,
                      progress: 100,
                      status: 'completed',
                    });
                  }
                  return next;
                });
              }
            } else {
              let errorMessage = 'Upload failed';
              try {
                const response = JSON.parse(xhr.responseText);
                errorMessage = response.error || errorMessage;
              } catch {
                errorMessage = `Upload failed (${xhr.status})`;
              }
              setUploads((prev) => {
                const next = new Map(prev);
                const existing = next.get(fileId);
                if (existing) {
                  next.set(fileId, { ...existing, status: 'error', error: errorMessage });
                }
                return next;
              });
            }
          });

          xhr.addEventListener('error', () => {
            setUploads((prev) => {
              const next = new Map(prev);
              const existing = next.get(fileId);
              if (existing) {
                next.set(fileId, {
                  ...existing,
                  status: 'error',
                  error: 'Network error',
                });
              }
              return next;
            });
          });

          xhr.open('POST', '/api/photos');
          xhr.send(formData);
        } catch (error) {
          setUploads((prev) => {
            const next = new Map(prev);
            const existing = next.get(fileId);
            if (existing) {
              next.set(fileId, {
                ...existing,
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error',
              });
            }
            return next;
          });
        }
      }
    },
    [category, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
      },
      maxSize: maxSizeMB * 1024 * 1024,
      maxFiles,
      disabled: false,
    });

  const removeUpload = useCallback((fileId: string) => {
    const controller = abortControllersRef.current.get(fileId);
    if (controller) {
      controller.abort();
      abortControllersRef.current.delete(fileId);
    }
    setUploads((prev) => {
      const next = new Map(prev);
      next.delete(fileId);
      return next;
    });
  }, []);

  const retryUpload = useCallback(
    async (fileId: string) => {
      const upload = uploads.get(fileId);
      if (!upload) return;

      // Re-create the upload with the same file
      // For simplicity, we'll just remove and let the user re-upload
      removeUpload(fileId);
    },
    [uploads, removeUpload]
  );

  const clearCompleted = useCallback(() => {
    setUploads((prev) => {
      const next = new Map(prev);
      for (const [id, upload] of next) {
        if (upload.status === 'completed' || upload.status === 'error') {
          next.delete(id);
        }
      }
      return next;
    });
  }, []);

  const completedCount = Array.from(uploads.values()).filter(
    (u) => u.status === 'completed'
  ).length;
  const errorCount = Array.from(uploads.values()).filter(
    (u) => u.status === 'error'
  ).length;

  if (completedCount > 0 && uploads.size === completedCount) {
    return (
      <div className={cn('rounded-xl border border-accent-200 bg-accent-50 p-6 dark:border-accent-800 dark:bg-accent-900/20', className)}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 text-white">
            <Check className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-accent-900 dark:text-accent-100">
              {completedCount} photo{completedCount !== 1 ? 's' : ''} uploaded!
            </p>
            <p className="text-sm text-accent-700 dark:text-accent-300">
              All uploads completed successfully
            </p>
          </div>
          <button
            onClick={clearCompleted}
            className="ml-auto rounded-lg border border-accent-300 px-3 py-1.5 text-sm font-medium text-accent-700 transition-colors hover:bg-accent-100 dark:border-accent-700 dark:text-accent-300 dark:hover:bg-accent-800"
          >
            Upload More
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'relative cursor-pointer rounded-xl border-2 border-dashed p-8 transition-colors',
          isDragActive && !isDragReject
            ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
            : isDragReject
            ? 'border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-900/20'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-primary-400 dark:hover:bg-gray-800/50'
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center text-center">
          <div
            className={cn(
              'mb-4 flex h-14 w-14 items-center justify-center rounded-full',
              isDragActive && !isDragReject
                ? 'bg-primary-100 text-primary-600 dark:bg-primary-800 dark:text-primary-300'
                : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
            )}
          >
            {isDragActive ? (
              <Upload className="h-7 w-7" />
            ) : (
              <ImagePlus className="h-7 w-7" />
            )}
          </div>

          <p className="text-base font-medium text-gray-700 dark:text-gray-300">
            {isDragActive ? 'Drop photos here' : 'Drag & drop photos here'}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            or{' '}
            <span className="text-primary-600 underline dark:text-primary-400">
              browse files
            </span>
          </p>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            PNG, JPG, GIF, WebP up to {maxSizeMB}MB • Max {maxFiles} files
          </p>
        </div>
      </div>

      {/* File rejections */}
      {fileRejections.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {fileRejections.length} file{fileRejections.length !== 1 ? 's' : ''} rejected
              </p>
              <ul className="mt-1 text-xs text-red-600 dark:text-red-300">
                {fileRejections.map((rejection) => (
                  <li key={rejection.file.name}>
                    {rejection.file.name}: {rejection.errors.map((e) => e.message).join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Upload progress list */}
      {uploads.size > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Uploading {uploads.size} file{uploads.size !== 1 ? 's' : ''}
            </p>
            {errorCount > 0 && (
              <span className="text-xs text-red-500">
                {errorCount} failed
              </span>
            )}
          </div>

          {Array.from(uploads.values()).map((upload) => (
            <div
              key={upload.fileId}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Status icon */}
              <div className="flex-shrink-0">
                {upload.status === 'uploading' && (
                  <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
                )}
                {upload.status === 'processing' && (
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                )}
                {upload.status === 'completed' && (
                  <Check className="h-5 w-5 text-green-500" />
                )}
                {upload.status === 'error' && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>

              {/* File info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                  {upload.fileName}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(upload.size)}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    •
                  </span>
                  <span
                    className={cn(
                      'text-xs',
                      upload.status === 'error'
                        ? 'text-red-500'
                        : upload.status === 'completed'
                        ? 'text-green-500'
                        : 'text-gray-500 dark:text-gray-400'
                    )}
                  >
                    {upload.status === 'uploading' && `${upload.progress}%`}
                    {upload.status === 'processing' && 'Processing...'}
                    {upload.status === 'completed' && 'Complete'}
                    {upload.status === 'error' && upload.error}
                  </span>
                </div>

                {/* Progress bar */}
                {upload.status === 'uploading' && (
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-primary-600 transition-all duration-300"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Remove/Retry button */}
              <button
                onClick={() =>
                  upload.status === 'error'
                    ? retryUpload(upload.fileId)
                    : removeUpload(upload.fileId)
                }
                className="flex-shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                aria-label="Remove"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
