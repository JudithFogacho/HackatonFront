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
        primary: {
          DEFAULT: '#004B62',
          light: '#E8F1F4',
          dark: '#003548',
        },
        secondary: {
          DEFAULT: '#FFCC00',
          light: '#FFE066',
          dark: '#E6B800',
        },
        success: {
          DEFAULT: '#4CAF50',
          light: '#E8F5E9',
        },
        danger: {
          DEFAULT: '#F44336',
          light: '#FFEBEE',
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
}
