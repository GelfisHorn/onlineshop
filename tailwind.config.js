/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        main: "#CAA42E",
        "main-hover": "#BA9110",

        "light-bg-primary": "#fff",
        "light-bg-secondary": "#FFFBF1",
        "light-text-primary": "#000",
        "light-text-secondary": "#525252",
        "light-border": "#E5E5E5",
        
        "dark-bg-primary": "#242321",
        "dark-bg-secondary": "#3E3B33",
        "dark-text-primary": "#F9F9F9",
        "dark-text-secondary": "#BFBFBF",
        "dark-border": "#404040",
      }
    },
  },
  plugins: [],
}
