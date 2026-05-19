/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode by class or media, setting class makes it easier
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        surface: '#1e293b',
        primary: '#3b82f6',
        primaryHover: '#2563eb',
        text: '#f8fafc',
        textMuted: '#94a3b8',
        border: '#334155',
        danger: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b',
      }
    },
  },
  plugins: [],
}
