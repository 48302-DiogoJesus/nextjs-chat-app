/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./_resources/icons.tsx"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)']
      },
      colors: {
        red: "#994e27",
        "light-blue": "#00d9dcd3"
      }
    },
  },
  plugins: [require("daisyui"), require("tw-elements/dist/plugin")],
}