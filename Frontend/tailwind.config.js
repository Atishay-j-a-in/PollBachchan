/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050505',
        glow: '#0d0d0d',
        line: '#1b1b1b',
        text: '#f5f5f5',
        muted: '#a9a9a9',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        heading: ['Cinzel', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
