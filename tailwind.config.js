/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '"Inter Placeholder"', 'sans-serif'],
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 0px rgb(59, 130, 246)' },
          '40%': { boxShadow: '0 0 20px rgb(59, 130, 246)' },
          '100%': { boxShadow: '0 0 0px rgb(59, 130, 246)' },
        }
      },
      animation: {
        glow: 'glow 0.4s ease-in-out',
      }
    },
  },
  plugins: [],
};