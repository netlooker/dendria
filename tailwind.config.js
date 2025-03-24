/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    // Using Tailwind defaults with no overrides
    extend: {
      // No custom extensions for now
    },
  },
  plugins: [],
}
