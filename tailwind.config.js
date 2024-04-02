/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'jetblack':'#343434',
        'primary':'#212121',
        'newpri' : '#1eb2a6',
      }
    },
  },
  plugins: [],
}