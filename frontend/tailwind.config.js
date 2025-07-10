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
        // Tokyo Night Palette (explicitly named)
        'tn-bg': '#1a1b26', // Main background
        'tn-fg': '#c0caf5', // Main foreground
        'tn-card': '#24283b', // Card background (slightly lighter than tn-bg)
        'tn-border': '#414868', // Borders
        'tn-comment': '#565f89', // Comments, subtle text
        'tn-blue': '#7aa2f7', // Blue
        'tn-cyan': '#7dcfff', // Cyan
        'tn-green': '#9ece6a', // Green
        'tn-purple': '#bb9af7', // Purple
        'tn-red': '#f7768e', // Red
        'tn-orange': '#ff9e64', // Orange
        'tn-yellow': '#e0af68', // Yellow

        // Semantic color names for use in components
        // These will be used with dark: prefixes, e.g., bg-background dark:bg-tn-bg
        // Light Theme Colors
        'background': '#f0f2f5', // Light gray background
        'foreground': '#1f2937', // Dark gray text
        'card': '#ffffff',       // White cards
        'card-foreground': '#1f2937',
        'popover': '#ffffff',
        'popover-foreground': '#1f2937',
        'primary': '#4f46e5',    // Indigo
        'primary-foreground': '#ffffff',
        'secondary': '#9ca3af',  // Gray
        'secondary-foreground': '#1f2937',
        'muted': '#d1d5db',      // Lighter gray
        'muted-foreground': '#4b5563',
        'accent': '#ec4899',     // Pink
        'accent-foreground': '#ffffff',
        'destructive': '#ef4444', // Red
        'destructive-foreground': '#ffffff',
        'border': '#d1d5db',     // Default border color
        'input': '#e5e7eb',      // Input field background
        'ring': '#4f46e5',       // Focus ring

        // Dark Theme Colors (referenced from Tokyo Night Palette)
        // These will be applied via dark: prefix in components, e.g. dark:bg-tn-bg
        // We define them here so Tailwind can generate utility classes if needed directly,
        // but the primary usage will be `text-foreground dark:text-tn-fg`, etc.
        // It's also good for overview.
        'dark-background': 'var(--tn-bg)',
        'dark-foreground': 'var(--tn-fg)',
        'dark-card': 'var(--tn-card)',
        'dark-card-foreground': 'var(--tn-fg)',
        'dark-popover': 'var(--tn-card)',
        'dark-popover-foreground': 'var(--tn-fg)',
        'dark-primary': 'var(--tn-blue)',
        'dark-primary-foreground': 'var(--tn-bg)', // Text on primary buttons (dark theme)
        'dark-secondary': 'var(--tn-comment)',
        'dark-secondary-foreground': 'var(--tn-fg)',
        'dark-muted': 'var(--tn-border)',
        'dark-muted-foreground': '#a9b1d6', // Brighter muted text for better visibility
        'dark-accent': 'var(--tn-purple)',
        'dark-accent-foreground': 'var(--tn-bg)',
        'dark-destructive': 'var(--tn-red)',
        'dark-destructive-foreground': 'var(--tn-fg)', // Brighter text on destructive buttons
        'dark-border': 'var(--tn-border)',
        'dark-input': 'var(--tn-card)', // Input bg in dark mode
        'dark-ring': 'var(--tn-blue)',

        // Retain 'gold' as it was specifically used, map to tn-yellow
        'gold': 'var(--tn-yellow)',
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