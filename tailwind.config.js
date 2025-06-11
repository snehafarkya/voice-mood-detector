/** @type {import('tailwindcss').Config} */
export default {
 content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}, ./src/App.tsx,",],
  safelist: [
    'bg-green-300',
    'bg-red-300',
    'bg-gray-300',
    'bg-yellow-400',
    'bg-white'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

