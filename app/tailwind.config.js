/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0E8',
        sage: '#8FAF8A',
        'sage-dark': '#6B9068',
        'cream-dark': '#E8E0D0',
        'soft-gold': '#C9A96E',
      },
      fontFamily: {
        sans: ['DM-Sans', 'System'],
      },
    },
  },
  plugins: [],
}
