/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ritual: {
          background: '#F7F1E8',
          card: '#FFF8EF',
          text: '#3B2A1A',
          muted: '#6D5C4D',
          gold: '#B88746',
          border: '#E8D9C5',
          brown: '#26190F',
          sage: '#8D9277',
          rose: '#B98279',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 60px rgba(59, 42, 26, 0.10)',
        lift: '0 20px 45px rgba(59, 42, 26, 0.14)',
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
        smoke: 'smoke 9s ease-in-out infinite alternate',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        smoke: {
          '0%': { transform: 'translateY(12px) scale(1)', opacity: '0.26' },
          '100%': { transform: 'translateY(-18px) scale(1.08)', opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};
