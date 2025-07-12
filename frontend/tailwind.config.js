module.exports = {
  content: ["./src/**/*.{jsx,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        soOrange: '#F48024', // Stack Overflow orange
        soBlue: '#0074CC', // Link and hover color
        soGray: '#E1E3E6', // Backgrounds
        soDarkGray: '#2F3337', // Text and borders
        soLightGray: '#F8F9F9', // Light backgrounds
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'], // Stack Overflow uses Roboto
      },
    },
  },
  plugins: [],
};