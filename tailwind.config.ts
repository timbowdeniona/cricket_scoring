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
        cricket: {
          green: '#0d3b1e',
          pitch: '#d4a373',
          dark: '#0a100d',
          card: '#121c17',
          accent: '#10b981',
          gold: '#f59e0b',
          boundary: '#ef4444',
        },
      },
    },
  },
  plugins: [],
};
export default config;
