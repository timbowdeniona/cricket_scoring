import type { Config } from 'tailwindcss';

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
          navy: '#050b18',
          dark: '#0a1226',
          card: '#0f1b38',
          border: '#1a2e5c',
          blue: '#1b4998',
          royal: '#2563eb',
          cream: '#f8f9fa',
          gold: '#f59e0b',
          goldDark: '#d97706',
          grass: '#10b981',
          pitch: '#d4a373',
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
