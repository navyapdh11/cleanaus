'use client';

import { useRef, useEffect } from 'react';

interface AnimatedBackgroundProps {
  variant?: 'mesh' | 'gradient' | 'aurora';
  className?: string;
  speed?: number;
}

export function AnimatedBackground({
  variant = 'mesh',
  className = '',
  speed = 1,
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const noise = (x: number, y: number, t: number): number => {
      return (
        Math.sin(x * 0.01 + t) *
        Math.cos(y * 0.01 + t * 0.7) *
        Math.sin((x + y) * 0.005 + t * 0.5)
      );
    };

    const renderMesh = () => {
      const w = canvas.width;
      const h = canvas.height;
      const gridSize = 80;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      for (let x = 0; x < w; x += gridSize) {
        for (let y = 0; y < h; y += gridSize) {
          const n = noise(x, y, time * speed * 0.001);
          const hue = 220 + n * 30;
          const saturation = 60 + n * 20;
          const lightness = 15 + n * 10;
          const alpha = 0.3 + n * 0.15;

          ctx.beginPath();
          ctx.arc(x, y, gridSize * 0.3 + n * 10, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
          ctx.fill();
        }
      }
    };

    const renderGradient = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      const gradients = [
        { x: w * 0.3 + Math.sin(time * 0.001 * speed) * 100, y: h * 0.4, color: '59, 130, 246', radius: 400 },
        { x: w * 0.7 + Math.cos(time * 0.0012 * speed) * 80, y: h * 0.6, color: '139, 92, 246', radius: 350 },
        { x: w * 0.5 + Math.sin(time * 0.0008 * speed) * 120, y: h * 0.3, color: '6, 182, 212', radius: 300 },
      ];

      gradients.forEach((g) => {
        const gradient = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.radius);
        gradient.addColorStop(0, `rgba(${g.color}, 0.15)`);
        gradient.addColorStop(0.5, `rgba(${g.color}, 0.05)`);
        gradient.addColorStop(1, `rgba(${g.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      });
    };

    const renderAurora = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const baseY = h * 0.3 + i * 40;

        for (let x = 0; x <= w; x += 5) {
          const y =
            baseY +
            Math.sin(x * 0.003 + time * 0.001 * speed + i) * 50 +
            Math.sin(x * 0.007 + time * 0.002 * speed) * 20;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        const hue = 200 + i * 25;
        const gradient = ctx.createLinearGradient(0, baseY - 100, 0, baseY + 200);
        gradient.addColorStop(0, `hsla(${hue}, 70%, 50%, 0)`);
        gradient.addColorStop(0.3, `hsla(${hue}, 70%, 50%, ${0.08 - i * 0.01})`);
        gradient.addColorStop(0.7, `hsla(${hue}, 70%, 50%, ${0.04 - i * 0.005})`);
        gradient.addColorStop(1, `hsla(${hue}, 70%, 50%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    };

    const animate = () => {
      if (document.hidden) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      time++;

      if (variant === 'mesh') renderMesh();
      else if (variant === 'gradient') renderGradient();
      else renderAurora();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [variant, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 ${className}`}
      style={{ opacity: 0.6 }}
    />
  );
}
