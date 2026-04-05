'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FlashcardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  onClick?: () => void;
  autoFlip?: boolean;
  delay?: number;
}

export function Flashcard({
  front,
  back,
  className,
  onClick,
  autoFlip = false,
  delay = 0,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInteraction = () => {
    setIsFlipped((prev) => !prev);
    onClick?.();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (autoFlip) {
      timeoutRef.current = setTimeout(() => {
        setIsFlipped(true);
      }, 600);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (autoFlip && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (autoFlip) {
      setIsFlipped(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn('perspective-1000 cursor-pointer', className)}
      onClick={handleInteraction}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: isHovered ? 1.02 : 1 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Front */}
        <div
          className={cn(
            'absolute inset-0 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 overflow-hidden',
            'shadow-xl shadow-black/10'
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
          
          {/* Subtle animated border */}
          <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-white/10 via-transparent to-white/5 -z-10" />

          <div className="relative z-10 h-full flex flex-col">
            {front}
          </div>

          {/* Flip hint */}
          <div className="absolute bottom-3 right-4 text-[10px] text-white/30 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Click to flip
          </div>
        </div>

        {/* Back */}
        <div
          className={cn(
            'absolute inset-0 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 overflow-hidden',
            'shadow-xl shadow-black/10'
          )}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5" />

          <div className="relative z-10 h-full flex flex-col">
            {back}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface FlashcardGridProps {
  cards: Array<{ id: string; front: React.ReactNode; back: React.ReactNode }>;
  className?: string;
  autoFlip?: boolean;
  columns?: 2 | 3 | 4;
}

export function FlashcardGrid({
  cards,
  className,
  autoFlip = false,
  columns = 3,
}: FlashcardGridProps) {
  const colMap = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-6', colMap[columns], className)}>
      {cards.map((card, i) => (
        <div key={card.id} className="aspect-[4/3]">
          <Flashcard
            front={card.front}
            back={card.back}
            autoFlip={autoFlip}
            delay={i * 0.1}
          />
        </div>
      ))}
    </div>
  );
}
