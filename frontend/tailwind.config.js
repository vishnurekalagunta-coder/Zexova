/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f5f7',
          100: '#ebebf0',
          200: '#d7d7e0',
          300: '#b8b8cc',
          400: '#8f8fb3',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#18181b',
          950: '#09090b',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Matte luxury surface definitions
        surface: {
          light: '#f5f5f7',       // Half White / Matte Ceramic Off-White
          dark: '#09090b',        // Stealth Matte Obsidian Black
          cardLight: '#ffffff',   // Crisp Matte White Card
          cardDark: '#111114',    // Premium Matte Dark Card
          subtleLight: '#f4f4f5', // Soft matte element in light mode
          subtleDark: '#18181b',  // Soft matte element in dark mode
          borderLight: '#e4e4e7', // Matte hairline border light
          borderDark: '#27272a'   // Matte hairline border dark
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'matte-sm': '0 1px 2px rgba(0, 0, 0, 0.03)',
        'matte-md': '0 2px 10px -2px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'matte-lg': '0 8px 30px -4px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'matte-dark': '0 6px 30px -4px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
      }
    },
  },
  plugins: [],
}
