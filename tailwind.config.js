/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep polar navy for text, dark sections and contrast
        polar: {
          950: '#060f1c',
          900: '#0b192c',
          850: '#0f223b',
          800: '#142c4b',
          700: '#1e3e67',
          600: '#2b5488',
          500: '#3e6da8',
          400: '#6794c9',
          300: '#9cbde2',
          200: '#cbdef1',
          100: '#e5eff8',
          50: '#f2f7fc',
        },
        // Glacier off-white & crisp surfaces
        glacier: {
          50: '#fbfcfd',
          100: '#f6f9fb',
          200: '#edf2f7',
          300: '#e1e9f1',
          border: '#d7e2ed',
        },
        // Cool ice-blue secondary
        ice: {
          50: '#f0f7fb',
          100: '#dfedf6',
          200: '#c2dded',
          300: '#94c3de',
          400: '#5da2cb',
          500: '#3582b2',
          600: '#226792',
          700: '#1a5174',
        },
        // ONE sharp accent: soft aurora teal / green used sparingly
        aurora: {
          50: '#edf8f5',
          100: '#d3f1e7',
          200: '#abe2d2',
          300: '#75cdb7',
          400: '#3eb499',
          500: '#159679',
          600: '#0d7962',
          700: '#0c614f',
          glow: 'rgba(21, 150, 121, 0.12)',
        },
      },
      fontFamily: {
        serif: ['"Fraunces"', '"Newsreader"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'body-base': ['17px', '28px'],
        'body-lg': ['19px', '30px'],
      },
      letterSpacing: {
        snug: '-0.015em',
        tightest: '-0.03em',
      },
      backgroundImage: {
        'polar-grid': "radial-gradient(circle at 1px 1px, rgba(11, 25, 44, 0.04) 1px, transparent 0)",
      }
    },
  },
  plugins: [],
}
