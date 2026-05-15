/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0D0D0D',
        sidebar: '#161616',
        header: '#C8102E',
        border: '#222222',
        'text-main': '#FAFAF8',
        'text-secondary': '#666666',
        success: '#4ade80',
        warning: '#f0a832',
        'error-color': '#ff6b80',
        'cat-badge': '#e05a78',
        'subcat-badge': '#6a9cf8',
      },
    },
  },
  plugins: [],
}

