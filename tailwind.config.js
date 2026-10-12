/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#2f2440',
        plum: '#6f4b92',
        lavender: '#f1eafe',
        rose: '#f4d4e8',
        blush: '#fff8fc',
        lime: '#d5f26c',
      },
      fontFamily: {
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Quicksand', 'Nunito', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        card: '0 20px 60px rgba(94, 63, 121, 0.12)',
        soft: '0 10px 30px rgba(94, 63, 121, 0.10)',
      },
    },
  },
  plugins: [],
}
