import type { Config } from 'tailwindcss';
import { colors } from './src/theme/tokens';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        malpas: {
          navy: colors.navy.DEFAULT,
          dark: colors.navy.dark,
          card: colors.navy.card,
          border: colors.navy.border,
          blue: colors.royal.DEFAULT,
          royal: colors.royal.bright,
          cream: colors.cream.DEFAULT,
          gold: colors.gold.DEFAULT,
          goldDark: colors.gold.dark,
          grass: colors.status.outfield,
          pitch: colors.status.pitch,
        },
      },
      backgroundImage: {
        'tie-stripes': "repeating-linear-gradient(135deg, rgba(248, 249, 250, 0.03), rgba(248, 249, 250, 0.03) 15px, transparent 15px, transparent 35px)",
      },
    },
  },
  plugins: [],
};
export default config;
