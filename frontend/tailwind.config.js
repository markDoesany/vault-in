/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'], // Classic, widely available sans-serif font
      },
      colors: {
        'primary': '#0D47A1', // A strong, trustworthy blue
        'primary-dark': '#002171', // Darker shade for hover/active states
        'secondary': '#E0E0E0', // Light gray for backgrounds or secondary elements
        'secondary-dark': '#BDBDBD', // Slightly darker gray
        'accent': '#1565C0', // A brighter blue for accents, links
        'text-primary': '#212121', // Dark gray for primary text, good contrast
        'text-secondary': '#757575', // Lighter gray for secondary text
        'background': '#FFFFFF', // Plain white background
        'border': '#BDBDBD', // Border color
        'success': '#2E7D32', // Green for success messages
        'error': '#C62828', // Red for error messages
      },
      borderRadius: {
        'DEFAULT': '0.25rem', // Standard small border radius
        'md': '0.375rem',
        'lg': '0.5rem',
      },
      boxShadow: {
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
  },
  plugins: [],
}