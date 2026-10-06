const plugin = require('tailwindcss/plugin');

// Native only: map Tailwind font weights to the Inter faces loaded in hooks/use-lumin-font.tsx.
// (Web uses the Inter variable font from Google Fonts + font-weight.)
module.exports = plugin(function ({ addUtilities }) {
  addUtilities({
    '.font-sans': { fontFamily: 'Inter_400Regular' },
    '.font-mono': { fontFamily: 'JetBrainsMono_400Regular' },
  });

  addUtilities({
    '.font-thin': { fontFamily: 'Inter_100Thin' },
    '.font-extralight': { fontFamily: 'Inter_200ExtraLight' },
    '.font-light': { fontFamily: 'Inter_300Light' },
    '.font-normal': { fontFamily: 'Inter_400Regular' },
    '.font-medium': { fontFamily: 'Inter_500Medium' },
    '.font-semibold': { fontFamily: 'Inter_600SemiBold' },
    '.font-bold': { fontFamily: 'Inter_700Bold' },
    '.font-extrabold': { fontFamily: 'Inter_800ExtraBold' },
    '.font-black': { fontFamily: 'Inter_900Black' },
  });
});
