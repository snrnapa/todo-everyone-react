/** @type {import('tailwindcss').Config} */
export default {
  content: [
    //この中の2行を追加
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
    fontFamily: {
      zenKurenaido: ['Zen Kurenaido', 'sans-serif'],
    },
  },
  plugins: [],
};
