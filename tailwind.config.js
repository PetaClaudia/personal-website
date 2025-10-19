/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'peach': '#EB6D6F',
        'yellow': '#EBAC6C',
        'fluro-yellow': '#EBEB69',
        'portfolio-red': '#8C2318',
        'portfolio-yellow': '#F2C45A',
      },
      fontFamily: {
        'poiret': ['"Poiret One"', 'cursive'],
        'hegarty': ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
