/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Temă paranormală cu culori întunecate și misterioase
        'paranormal': {
          50: '#f8fafc',   // Foarte deschis pentru text
          100: '#f1f5f9',  // Deschis pentru conținut
          200: '#e2e8f0',  // Gri deschis
          300: '#cbd5e1',  // Gri mediu
          400: '#94a3b8',  // Gri
          500: '#64748b',  // Gri închis
          600: '#475569',  // Foarte închis
          700: '#334155',  // Pentru navbar
          800: '#1e293b',  // Fundal întunecat
          900: '#0f172a',  // Cel mai întunecat
        },
        'mystery': {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',  // Purple misterios
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        'ghost': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Verde spectral
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      fontFamily: {
        'paranormal': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      boxShadow: {
        'paranormal': '0 4px 14px 0 rgba(0, 0, 0, 0.39)',
        'mystery': '0 8px 32px rgba(148, 0, 211, 0.35)',
      }
    },
  },
  plugins: [],
} 