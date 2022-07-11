/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  corePlugins: {
    preflight: false,
  },
  important: true,
  theme: {
    extend: {},
  },
  plugins: [],
};
