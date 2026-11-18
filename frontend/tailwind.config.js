/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aura: {
          bg: '#FCEDF0',
          'bg-subtle': '#FFF5F7',
          'card': '#FFFFFF',
          plum: {
            DEFAULT: '#581C38',
            hover: '#421229',
            light: '#FCE7EE',
            text: '#3A0D22',
            muted: '#8B6A78',
          },
          lavender: {
            bg: '#F3E8FF',
            badge: '#EDE9FE',
            text: '#6B21A8',
            accent: '#8B5CF6',
          },
          mint: {
            bg: '#E0F7F6',
            badge: '#CCFBF1',
            text: '#0F766E',
            accent: '#14B8A6',
          },
          coral: {
            bg: '#FFEAEA',
            badge: '#FFE4E6',
            text: '#BE123C',
            accent: '#F43F5E',
          },
          cream: {
            bg: '#FEF7E6',
            badge: '#FEF3C7',
            text: '#B45309',
            accent: '#F59E0B',
          },
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Lora', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(220, 160, 180, 0.15)',
        'soft-lg': '0 20px 40px -15px rgba(220, 160, 180, 0.22)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
