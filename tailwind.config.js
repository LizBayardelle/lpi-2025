/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/views/**/*.html.erb",
    "./app/helpers/**/*.rb",
    "./app/assets/stylesheets/**/*.css",
    "./app/javascript/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'display': ['Fraunces', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'tighter': '-0.04em',
        'tight': '-0.02em',
        'normal': '0',
        'wide': '0.02em',
      },
      lineHeight: {
        'tighter': '1.1',
        'tight': '1.2',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
      },
    },
  },
  plugins: [],
}