import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
  border?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  intensity = 'medium',
  border = true,
  hover = true,
  onClick,
}: GlassCardProps) {
  const blurMap = {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    strong: 'backdrop-blur-xl',
  };

  const bgMap = {
    light: 'bg-white/5 dark:bg-white/5',
    medium: 'bg-white/10 dark:bg-white/5',
    strong: 'bg-white/15 dark:bg-white/10',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        bgMap[intensity],
        blurMap[intensity],
        border && 'border border-white/20 dark:border-white/10',
        hover && 'transition-all duration-500 hover:bg-white/15 dark:hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Glass reflection effect */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      {/* Subtle inner border glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'card' | 'panel' | 'modal';
}

export function GlassContainer({
  children,
  className,
  variant = 'card',
}: GlassContainerProps) {
  const variantStyles = {
    card: 'rounded-2xl p-6',
    panel: 'rounded-3xl p-8',
    modal: 'rounded-3xl p-8 shadow-2xl',
  };

  return (
    <GlassCard intensity="medium" className={cn(variantStyles[variant], className)}>
      {children}
    </GlassCard>
  );
}

interface GlassButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function GlassButton({
  children,
  className,
  onClick,
  disabled,
  variant = 'primary',
}: GlassButtonProps) {
  const variants = {
    primary:
      'bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-500/90 hover:to-purple-500/90 text-white shadow-lg shadow-blue-500/20',
    secondary:
      'bg-white/10 hover:bg-white/20 text-white border border-white/20',
    ghost:
      'bg-transparent hover:bg-white/10 text-white/80 hover:text-white',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative overflow-hidden rounded-xl px-5 py-2.5 text-sm font-medium',
        'backdrop-blur-md transition-all duration-300',
        'active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 hover:translate-x-full" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
