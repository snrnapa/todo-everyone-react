/** @type {import('tailwindcss').Config} */
export default {
  content: [
    //この中の2行を追加
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        personaBlue: '#15C2FC',
        personaTextWhite: '#F9F9F9',
      }
    },
    fontFamily: {
      zenKurenaido: ['Zen Kurenaido', 'sans-serif'],
    },
  },
  plugins: [],
};
