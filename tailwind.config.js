/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'system-ui', 'sans-serif'],
        satoshi: ['Satoshi', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#110F0F',
          charcoal: '#212121',
          muted: '#555555',
          light: '#F8F8F8',
          border: '#E5E5E5',
        }
      }
    },
  },
  plugins: [],
}
