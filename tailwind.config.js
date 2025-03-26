/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dendria: {
          'primary': '#4D7C8A',
          'secondary': '#7FB069',
          'accent': '#F7C59F',
          'bg-light': '#F8F9FA',
          'bg-dark': '#1A1A1A',
          'text-light': '#333333',
          'text-dark': '#E0E0E0',
          'border-light': '#DDDDDD',
          'border-dark': '#444444'
        }
      }
    },
  },
  plugins: [],
}
