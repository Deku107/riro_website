/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        primary: '#0ea5e9',
        accent: '#FFE55C',
        custom: {
          400: '#5DC2EA',
          500: '#5DC2EA',
          600: '#4AB5E0',
          700: '#EEBD3D',
          800: '#CF86E0',
          900: '#E53253',
          100: '#F75E75',
          200: '#FF1500',
          300: '#0e172c',
          bg: '#fffffe',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        muted: '#64748b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 60px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
