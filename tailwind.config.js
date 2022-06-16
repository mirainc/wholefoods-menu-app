module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      white: "#FFFFFF",
      turquoise: "#38bdb7",
      darkGray: "#292929",
    },
    fontFamily: {
      "vesper-libre": '"Libre Baskerville"',
      "open-sans": '"Open Sans"',
    },
    extend: {
      fontSize: {
        "9xl": "8.5rem",
      },
    },
  },
  plugins: [],
};
