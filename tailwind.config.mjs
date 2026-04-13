/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        surface: '#0c0e17',
        'surface-container-low': '#11131d',
        'surface-container': '#171924',
        'surface-container-high': '#1c1f2b',
        'surface-container-highest': '#222532',
        'on-surface': '#f0f0fd',
        'on-surface-variant': '#737580',
        primary: '#10b981',
        'primary-dim': '#059669',
        secondary: '#34d399',
        'secondary-container': '#064e3b',
        tertiary: '#6ee7b7',
        'outline-variant': '#464752',
      },
      fontFamily: {
        headline: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 40px 0px rgba(16, 185, 129, 0.08)',
      },
      borderRadius: {
        xl: '0.75rem',
      },
    },
  },
  plugins: [],
}
