const { hairlineWidth } = require('nativewind/theme');
const interFontPlugin = require('./plugins/interFontPlugin.js');
const { platformSelect } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './examples/**/*.{ts,tsx}',
    './node_modules/@rnr/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Lumin DS text styles use Inter (DS-shadcn-000 › text-*/…); code uses JetBrains Mono.
      fontFamily: {
        sans: ['Inter'],
        mono: ['JetBrains Mono'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // ◆ In-app: components/card-* (Tool Tile, Banner)
        'card-red': {
          DEFAULT: 'hsl(var(--card-red))',
          foreground: 'hsl(var(--card-red-foreground))',
        },
        'card-orange': {
          DEFAULT: 'hsl(var(--card-orange))',
          foreground: 'hsl(var(--card-orange-foreground))',
        },
        'card-amber': {
          DEFAULT: 'hsl(var(--card-amber))',
          foreground: 'hsl(var(--card-amber-foreground))',
        },
        'card-yellow': {
          DEFAULT: 'hsl(var(--card-yellow))',
          foreground: 'hsl(var(--card-yellow-foreground))',
        },
        'card-lime': {
          DEFAULT: 'hsl(var(--card-lime))',
          foreground: 'hsl(var(--card-lime-foreground))',
        },
        'card-green': {
          DEFAULT: 'hsl(var(--card-green))',
          foreground: 'hsl(var(--card-green-foreground))',
        },
        'card-teal': {
          DEFAULT: 'hsl(var(--card-teal))',
          foreground: 'hsl(var(--card-teal-foreground))',
        },
        'card-cyan': {
          DEFAULT: 'hsl(var(--card-cyan))',
          foreground: 'hsl(var(--card-cyan-foreground))',
        },
        'card-sky': {
          DEFAULT: 'hsl(var(--card-sky))',
          foreground: 'hsl(var(--card-sky-foreground))',
        },
        'card-blue': {
          DEFAULT: 'hsl(var(--card-blue))',
          foreground: 'hsl(var(--card-blue-foreground))',
        },
        'card-indigo': {
          DEFAULT: 'hsl(var(--card-indigo))',
          foreground: 'hsl(var(--card-indigo-foreground))',
        },
        'card-violet': {
          DEFAULT: 'hsl(var(--card-violet))',
          foreground: 'hsl(var(--card-violet-foreground))',
        },
        'card-pink': {
          DEFAULT: 'hsl(var(--card-pink))',
          foreground: 'hsl(var(--card-pink-foreground))',
        },
        'card-rose': {
          DEFAULT: 'hsl(var(--card-rose))',
          foreground: 'hsl(var(--card-rose-foreground))',
        },
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    platformSelect({ native: interFontPlugin, default: [] }),
    require('tailwindcss-animate'),
  ],
};
