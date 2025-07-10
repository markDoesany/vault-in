/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // or 'media' if you prefer OS-level setting
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
      colors: {
        // Tokyo Night Dark Theme
        'tn-bg': '#1a1b26',      // Background
        'tn-fg': '#c0caf5',      // Foreground text
        'tn-card': '#24283b',    // Card / secondary background
        'tn-comment': '#565f89', // Comments, subtle text
        'tn-blue': '#7aa2f7',
        'tn-cyan': '#7dcfff',
        'tn-green': '#9ece6a',
        'tn-orange': '#ff9e64',
        'tn-red': '#f7768e',
        'tn-purple': '#bb9af7',
        'tn-yellow': '#e0af68',
        'tn-border': '#414868',  // A slightly lighter border for cards

        // Original colors (can be used for a light theme or as fallbacks)
        'primary': '#0D47A1',
        'primary-dark': '#002171',
        'secondary': '#E0E0E0', // Will be tn-card in dark mode
        'secondary-dark': '#BDBDBD',
        'accent': '#1565C0',    // Will be tn-blue or tn-purple in dark mode
        'text-primary': '#212121', // Will be tn-fg in dark mode
        'text-secondary': '#757575',// Will be tn-comment in dark mode
        'background': '#FFFFFF', // Will be tn-bg in dark mode
        'border': '#BDBDBD',     // Will be tn-border in dark mode
        'success': '#2E7D32',    // Can be tn-green
        'error': '#C62828',      // Can be tn-red

        // Specific dark mode overrides if needed, otherwise Tailwind's dark: prefix will use these
        'gold': '#e0af68', // Keeping 'gold' as it was used, maps to tn-yellow
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
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