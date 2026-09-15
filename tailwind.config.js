/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          850: '#0c1b33',
          900: '#0a1728',
          950: '#070f1e',
        },
        sugam: {
          navy: '#0B192C',
          navyLight: '#1E2E45',
          blue: '#1E40AF',
          blueAccent: '#2563EB',
          sky: '#0284C7',
          teal: '#0D9488',
          green: '#10B981',
          amber: '#D97706',
          orange: '#EA580C',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
        'card': '0 2px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
