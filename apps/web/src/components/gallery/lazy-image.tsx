'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  thumbnailSrc?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
  placeholderColor?: string;
}

export function LazyImage({
  src,
  alt,
  className,
  thumbnailSrc,
  width,
  height,
  onLoad,
  onError,
  placeholderColor = 'bg-gray-200 dark:bg-gray-700',
}: LazyImageProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  return (
    <div
      ref={imgRef}
      className={cn('relative overflow-hidden', placeholderColor, !isLoaded && 'animate-pulse', className)}
      style={width && height ? { aspectRatio: `${width}/${height}` } : undefined}
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {isIntersecting && !hasError && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={isLoaded ? src : thumbnailSrc || src}
            alt={alt}
            className={cn(
              'h-full w-full object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
          />
        </>
      )}

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="mt-2 text-xs">Failed to load</span>
        </div>
      )}
    </div>
  );
}
