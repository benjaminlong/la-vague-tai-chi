/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/*.{njk,md,html}", "./src/**/*.{njk,md,html}", "./src/**/*.svg",],
  darkMode: 'selector',
  theme: {
    extend: {},
  },
  plugins: [
      require('@tailwindcss/typography'),
  ],
}
