/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts,js,tsx,jsx}'],
  theme: {
    extend: {
      colors: {
        primaryBlue: 'rgb(var(--color-primary-blue) / <alpha-value>)',
        primaryDark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
        thaiRed: 'rgb(var(--color-thai-red) / <alpha-value>)',
        softPurple: 'rgb(var(--color-soft-purple) / <alpha-value>)',
        page: 'rgb(var(--color-page) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        surfaceMuted: 'rgb(var(--color-surface-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        textDark: 'rgb(var(--color-text-dark) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
      },
      borderRadius: {
        card: '1rem',
      },
      boxShadow: {
        soft: '0 14px 35px rgba(23, 16, 51, 0.08)',
      },
    },
  },
  plugins: [],
}
