/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#070a15',
        'bg-alt': '#0d1224',
        surface: 'rgba(255, 255, 255, 0.06)',
        'surface-hover': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '32px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6, #06b6d4)',
        'gradient-accent': 'linear-gradient(135deg, #8b5cf6, #ec4899)',
        'gradient-success': 'linear-gradient(135deg, #10b981, #06b6d4)',
        'gradient-warning': 'linear-gradient(135deg, #f59e0b, #f97316)',
        'gradient-hero': 'linear-gradient(135deg, #a855f7, #6366f1)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 12px rgba(99, 102, 241, 0.3)' },
          '50%': { boxShadow: '0 0 32px rgba(99, 102, 241, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        shimmer: 'shimmer 2.5s infinite',
        fadeInUp: 'fadeInUp 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
      },
    },
  },
  plugins: [],
}
