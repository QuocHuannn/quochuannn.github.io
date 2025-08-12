/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Cream White Base Colors
        cream: {
          50: '#FEFCF8',
          100: '#FDF9F3',
          200: '#FBF3E7',
          300: '#F8EDDB',
          400: '#F5E7CF',
          500: '#F2E1C3', // Primary cream
          600: '#EFDBB7',
          700: '#ECD5AB',
          800: '#E9CF9F',
          900: '#E6C993',
        },
        // Dynamic Accent Colors
        accent: {
          blue: '#4A90E2',
          purple: '#8E44AD',
          teal: '#1ABC9C',
          orange: '#F39C12',
          pink: '#E91E63',
          green: '#27AE60',
        },
        // Neutral Colors
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(74, 144, 226, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(74, 144, 226, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};
