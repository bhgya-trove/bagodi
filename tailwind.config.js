/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#171717',
          50: '#F7F7F7',
          100: '#EAEAEA',
          200: '#D5D5D5',
          300: '#A3A3A3',
          400: '#737373',
          500: '#525252',
          600: '#3D3D3D',
          700: '#2A2A2A',
          800: '#1F1F1F',
          900: '#171717',
          950: '#0E0E0E',
        },
        warmWhite: '#FAF9F6',
        gold: {
          light: '#F8F4EB',
          subtle: '#EFE7D3',
          DEFAULT: '#B89A60',
          hover: '#A58850',
          dark: '#8E733D',
        },
        bagodi: {
          text: '#252525',
          muted: '#777777',
          border: '#EAEAEA',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Outfit"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
        'float': '0 20px 40px -15px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

