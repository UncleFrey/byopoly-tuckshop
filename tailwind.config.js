/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        oxblood: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          400: '#60A5FA',
          600: '#2563EB',
          700: '#1D4ED8',
          900: '#1E3A8A',
        },
        charcoal: {
          DEFAULT: '#111111',
          800: '#1F2937',
          700: '#374151',
        },
        parchment: {
          DEFAULT: '#FFFFFF',
          100: '#FFFFFF',
          200: '#F8FAFC',
          300: '#E2E8F0',
        },
        amber: {
          DEFAULT: '#2563EB',
          400: '#3B82F6',
          500: '#2563EB',
          600: '#1D4ED8',
        },
        signal: {
          green: '#2563EB',
          rust: '#1E3A8A',
        },
      },
      fontFamily: {
        display: ['"Chakra Petch"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        plate: '0 1px 0 rgba(255,255,255,0.4) inset, 0 8px 20px -8px rgba(30,32,35,0.35)',
      },
      keyframes: {
        'rise-in': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'rise-in': 'rise-in 0.5s ease-out both',
        'pop': 'pop 0.25s ease-out both',
      },
    },
  },
  plugins: [],
}
