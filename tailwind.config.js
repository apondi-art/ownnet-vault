/** @type {import('tailwindcss').Config */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        main: 'var(--main)',
        'main-light': 'var(--main-light)',
        'main-dark': 'var(--main-dark)',
        'main-foreground': 'var(--main-foreground)',
        background: 'var(--background)',
        'secondary-background': 'var(--secondary-background)',
        foreground: 'var(--foreground)',
        'muted-foreground': 'var(--muted-foreground)',
        border: 'var(--border)',
        'border-light': 'var(--border-light)',
        overlay: 'var(--overlay)',
        ring: 'var(--ring)',
        success: 'var(--success)',
        'success-light': 'var(--success-light)',
        warning: 'var(--warning)',
        'warning-light': 'var(--warning-light)',
        error: 'var(--error)',
        'error-light': 'var(--error-light)',
        info: 'var(--info)',
        purple: 'var(--purple)',
        pink: 'var(--pink)',
        accent: 'var(--accent)',
      },
      boxShadow: {
        'glow': 'var(--shadow-glow)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      borderRadius: {
        'base': '10px',
        'lg': '14px',
        'xl': '18px',
        '2xl': '22px',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient-shift 4s ease infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backgroundSize: {
        '300%': '300% 300%',
      },
    },
  },
  plugins: [],
}