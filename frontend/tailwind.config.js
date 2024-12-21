/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: '#F37ED1', 
        grey:'#2A4563'
        // Custom color name: 'pink', with the hex value
      },
    },
  },
  plugins: [],
};
