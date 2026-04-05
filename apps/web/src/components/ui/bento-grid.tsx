'use client';

import { useRef, ReactNode, useCallback } from 'react';
import { motion, useInView, useMotionValue, useMotionTemplate, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BentoItemProps {
  children: ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  delay?: number;
  glow?: boolean;
  tilt?: boolean;
}

export function BentoItem({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
  delay = 0,
  glow = true,
  tilt = true,
}: BentoItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(0, { stiffness: 150, damping: 15, mass: 0.5 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 15, mass: 0.5 });

  const colMap = { 1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3' };
  const rowMap = { 1: 'row-span-1', 2: 'row-span-2' };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
    if (tilt) {
      rotateX.set(((y - rect.height / 2) / (rect.height / 2)) * -5);
      rotateY.set(((x - rect.width / 2) / (rect.width / 2)) * 5);
    }
  }, [tilt, mouseX, mouseY, rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    if (tilt) { rotateX.set(0); rotateY.set(0); }
  }, [tilt, mouseX, mouseY, rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tilt ? { transformPerspective: 1000, rotateX, rotateY } : undefined}
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6',
        colMap[colSpan],
        rowMap[rowSpan],
        className
      )}
    >
      {glow && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(99,102,241,0.15), transparent 60%)`,
          }}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

interface BentoGridProps {
  children: ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

export function BentoGrid({ children, className, columns = 3 }: BentoGridProps) {
  const colMap = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return <div className={cn('grid gap-4', colMap[columns], className)}>{children}</div>;
}
