/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0f0f12',
          raised: '#17171c',
          border: '#26262e',
        },
        accent: {
          DEFAULT: '#7c5cff',
          hover: '#8f72ff',
        },
        text: {
          primary: '#e8e8ec',
          secondary: '#9a9aa5',
          muted: '#5f5f6b',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'ui-serif', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
