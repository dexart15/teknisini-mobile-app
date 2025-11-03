/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        grayDark: "#4A4A4A",
        softGrayText: "#A6A6A6",
        grayText: "#515151",
        primary: "#32A4FF",
        secondary: "#E6F4FF",
        white: "#FFFFFF",
      },
      fontFamily: {
        poppins: ["Poppins-Regular"],
        "poppins-medium": ["Poppins-Medium"],
        "poppins-semibold": ["Poppins-SemiBold"],
        "poppins-bold": ["Poppins-Bold"],
        "poppins-extra-bold": ["Poppins-ExtraBold"],
        "poppins-black": ["Poppins-Black"],
      },
    },
  },
  plugins: [],
};
