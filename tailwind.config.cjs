const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'on-primary': 'var(--color-on-primary)',
        ink: 'var(--color-ink)',
        body: 'var(--color-body)',
        'body-strong': 'var(--color-body-strong)',
        mute: 'var(--color-mute)',
        canvas: 'var(--color-canvas)',
        'canvas-soft': 'var(--color-canvas-soft)',
        hairline: 'var(--color-hairline)',
        default: 'var(--color-ink)',
        muted: 'var(--color-mute)',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['DM Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        serif: ['Instrument Serif', 'Georgia', '"Times New Roman"', 'serif'],
        heading: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        none: '0px',
        xxs: '1px',
        xs: '2px',
        sm: '3px',
        md: '4px',
        lg: '6px',
        pill: '9999px',
        full: '9999px',
      },
      fontSize: {
        'display-xl': ['64px', { lineHeight: '70.4px', letterSpacing: '-1.6px', fontWeight: '400' }],
        'display-lg': ['48px', { lineHeight: '52.8px', letterSpacing: '-1.2px', fontWeight: '400' }],
        'display-md': ['32px', { lineHeight: '40px', letterSpacing: '-0.8px', fontWeight: '500' }],
        'display-sm': ['24px', { lineHeight: '32px', letterSpacing: '-0.4px', fontWeight: '500' }],
        'display-serif': ['48px', { lineHeight: '52px', letterSpacing: '-0.5px', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '28px' }],
        'body-md': ['16px', { lineHeight: '24px' }],
        'body-sm': ['14px', { lineHeight: '20px' }],
        caption: ['12px', { lineHeight: '16px' }],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
};
