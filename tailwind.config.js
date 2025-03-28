/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors : {
        tint : "#FF9900",
        background : "#0D0D0D",
        secondaryBg : "#1E1E1E",
        border : "#2A2A2A" ,
        text: "#FFFFFF",
        secondaryText : "#787878"
      },
      padding : {
        horizontal : "16px"
      }
    },
  },
  plugins: [],
}

