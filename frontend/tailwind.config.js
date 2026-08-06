import path from 'path';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./frontend/**/*.{html,js,jsx,ts,tsx}",
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          card: 'var(--bg-card)',
          hover: 'var(--bg-hover)',
          input: 'var(--bg-input)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          accent: 'var(--text-accent)',
        },
        accent: {
          DEFAULT: 'var(--accent-color)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
        },
        border: {
          DEFAULT: 'var(--border-color)',
          focus: 'var(--border-focus)',
        }
      },
    },
  },
  plugins: [],
}
