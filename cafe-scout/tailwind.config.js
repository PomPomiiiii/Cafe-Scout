/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        scout: '#2C1810',
        'scout-green': '#1D9E75',
        'scout-light': '#FAF7F2',
        'scout-warm': '#F0E6D3',
        'scout-muted': '#8B7355',
        'scout-border': '#E8DDD0',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}