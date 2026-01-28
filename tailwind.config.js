/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'void': '#0a0a0f',
        'deep-space': '#0d1117',
        'nebula': '#161b22',
        'starlight': '#c9d1d9',
        'bright-star': '#f0f6fc',
        'quantum-blue': '#58a6ff',
        'plasma-cyan': '#39c5cf',
        'energy-purple': '#a371f7',
      },
      fontFamily: {
        'display': ['Space Mono', 'monospace'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
