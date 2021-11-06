module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        Montserrat: ['Montserrat'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
  ],
  important: true,
}
