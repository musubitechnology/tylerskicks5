/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        byu: {
          navy: '#002E5D',
          royal: '#0062B8',
        },
      },
    },
  },
  plugins: [],
};