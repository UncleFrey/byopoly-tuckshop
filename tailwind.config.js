/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        oxblood: {
          DEFAULT: '#7A1F2E',
          50: '#FBEAEC',
          100: '#F3CBD1',
          400: '#A83B4C',
          600: '#7A1F2E',
          700: '#601825',
          900: '#3A0E17',
        },
        charcoal: {
          DEFAULT: '#1E2023',
          800: '#2A2D31',
          700: '#3A3E44',
        },
        parchment: {
          DEFAULT: '#F6F2E9',
          100: '#FCFAF5',
          200: '#F6F2E9',
          300: '#ECE5D6',
        },
        amber: {
          DEFAULT: '#E2A63B',
          400: '#EAB65B',
          500: '#E2A63B',
          600: '#C68A22',
        },
        signal: {
          green: '#3E7A5C',
          rust: '#C0532B',
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
