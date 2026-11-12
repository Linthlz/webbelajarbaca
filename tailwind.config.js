/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', 'Nunito', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#FFF7E3',
        ink: '#2C3A57',
        sun: { DEFAULT: '#FFC533', dark: '#E0A100', soft: '#FFF0BF' },
        sky: { DEFAULT: '#45B4F2', dark: '#1F8FD0', soft: '#D9F0FF' },
        coral: { DEFAULT: '#FF7B6B', dark: '#DB5646', soft: '#FFE1DC' },
        mint: { DEFAULT: '#37C98B', dark: '#1FA56C', soft: '#D5F6E6' },
        grape: { DEFAULT: '#9A7BF2', dark: '#7557CF', soft: '#EAE2FF' },
        tangerine: { DEFAULT: '#FF9F43', dark: '#DE7C1D', soft: '#FFE8CF' },
      },
      boxShadow: {
        card: '0 6px 0 0 rgba(44,58,87,0.10)',
      },
      keyframes: {
        wiggle: {
          '0%,100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        soundwave: {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(1.7)', opacity: '0' },
        },
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        floaty: 'floaty 3s ease-in-out infinite',
        soundwave: 'soundwave 1s ease-out infinite',
      },
    },
  },
  plugins: [],
}
