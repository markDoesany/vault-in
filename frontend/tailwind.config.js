/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: '#1a2238', // Deep navy
        secondary: '#23272f', // Charcoal
        gold: '#ffbf00', // Gold accent
        silver: '#c0c0c0', // Silver accent
        background: '#f5f6fa', // Off-white background
      },
      borderRadius: {
        xl: '1rem',
      },
      boxShadow: {
        confident: '0 4px 24px 0 rgba(26,34,56,0.12)',
      },
      fontWeight: {
        confident: '700',
      },
    },
  },
  plugins: [],
}