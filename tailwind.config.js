const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/*.{njk,md,html}", "./src/**/*.{njk,md,html}", "./src/**/*.svg", "./eleventy.config.js",],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        // Primary brand palette, used in markup as `bg-brand-500`,
        // `text-brand-700`, etc. Re-skin a site by pointing this at a
        // different Tailwind color (e.g. `colors.blue`) — one line, one place.
        brand: colors.red,
      },
    },
  },
  plugins: [
      require('@tailwindcss/typography'),
  ],
}
