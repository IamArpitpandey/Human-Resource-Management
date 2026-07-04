/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // 🌈 Primary brand — Indigo (kept) + new accent system
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // 💜 Accent — Purple (new)
        accent: {
          50:  '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        // 🎨 Semantic colors
        success: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50:  '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        danger: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        },
        info: {
          50:  '#ecfeff',
          100: '#cffafe',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-1':           'radial-gradient(at 40% 20%, rgb(99 102 241 / 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgb(168 85 247 / 0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, rgb(236 72 153 / 0.10) 0px, transparent 50%)',
      },
      boxShadow: {
        'soft':     '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow':     '0 0 30px rgba(99, 102, 241, 0.35)',
        'glow-lg':  '0 0 50px rgba(99, 102, 241, 0.45)',
        'inner-glow': 'inset 0 0 20px rgba(99, 102, 241, 0.15)',
        'card':     '0 4px 20px -2px rgba(99, 102, 241, 0.08), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 20px 40px -10px rgba(99, 102, 241, 0.20), 0 8px 16px -4px rgba(0, 0, 0, 0.06)',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%':   { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%':   { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%':   { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' },
          '50%':      { boxShadow: '0 0 40px rgba(99, 102, 241, 0.7)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        'gradient': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'ping-soft': {
          '75%, 100%': { transform: 'scale(1.4)', opacity: '0' },
        },
      },
      animation: {
        'fade-in':       'fade-in 0.5s ease-out',
        'fade-in-up':    'fade-in-up 0.5s ease-out forwards',
        'fade-in-down':  'fade-in-down 0.5s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.4s ease-out forwards',
        'slide-in-right':'slide-in-right 0.4s ease-out forwards',
        'scale-in':      'scale-in 0.3s ease-out forwards',
        'pulse-glow':    'pulse-glow 2s ease-in-out infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'float':         'float 6s ease-in-out infinite',
        'gradient':      'gradient 8s ease infinite',
        'spin-slow':     'spin-slow 8s linear infinite',
        'bounce-soft':   'bounce-soft 2s ease-in-out infinite',
        'ping-soft':     'ping-soft 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
};
