'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  duration?: number;
  once?: boolean;
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 0.7,
  once = true,
}: AnimatedSectionProps) {
  const directions = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { y: 0, x: 60 },
    right: { y: 0, x: -60 },
    scale: { y: 0, x: 0 },
  };

  const { y, x } = directions[direction];

  return (
    <motion.div
      initial={{ opacity: 0, y, x, scale: direction === 'scale' ? 0.9 : 1 }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once, margin: '-80px' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

interface StaggeredChildrenProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  containerClassName?: string;
}

export function StaggeredChildren({
  children,
  className,
  staggerDelay = 0.1,
  containerClassName,
}: StaggeredChildrenProps) {
  return (
    <motion.div
      className={containerClassName}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children.map((child, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
            },
          }}
          className={className}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

interface ParallaxTextProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxText({ children, className, speed = 0.5 }: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-50 * speed, 50 * speed]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

