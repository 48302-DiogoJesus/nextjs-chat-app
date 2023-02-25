/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        red: "#994e27",
        "light-blue": "#00d9dcd3"
      }
    },
  },
  plugins: [require("daisyui"), require("tw-elements/dist/plugin")],
}