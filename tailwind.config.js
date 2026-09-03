/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/*.{njk,md,html}", "./src/**/*.{njk,md,html}", "./src/**/*.svg", "./eleventy.config.js",],
  darkMode: 'selector',
  theme: {
    extend: {},
  },
  plugins: [
      require('@tailwindcss/typography'),
  ],
}
