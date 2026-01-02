
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        background: {
          start: '#000000',
          end: '#1E293B',
        },
        surface: '#1E293B',
        primary: {
          DEFAULT: '#3B82F6',
          gradient: '#06B6D4',
        },
        text: {
          primary: '#E6E6E6',
          secondary: '#C8CACC',
          muted: '#6B7280',
        },
        success: {
          bg: '#F3F8F4',
          text: '#22C55E',
        },
        error: {
          bg: 'rgba(239, 68, 68, 0.1)',
          text: '#FF5C5C',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
