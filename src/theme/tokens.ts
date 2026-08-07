/**
 * Malpas Cricket Club (Cheshire) - Official Design System Tokens
 * Derived from official club crest (badge.jpg) and traditional club tie (tie.jpg).
 */

export const colors = {
  // Brand Base & Backgrounds
  navy: {
    DEFAULT: '#050b18', // Deep Navy base background (tie field)
    dark: '#0a1226',    // Dark panel surface
    card: '#0f1b38',    // Semi-transparent glass card surface
    border: '#1a2e5c',  // Subtle panel border
  },
  // Primary Accent (Crest Shield)
  royal: {
    DEFAULT: '#1b4998', // M.D.S.C. Royal Blue primary button/header accent
    bright: '#2563eb',  // Active state / highlight blue
    light: '#3b82f6',   // Focus ring & subtle text highlight
  },
  // Secondary Accent (Tie Stripes)
  cream: {
    DEFAULT: '#f8f9fa', // Off-white cream text & diagonal stripe accent
    muted: '#e2e8f0',   // Muted secondary text
    border: 'rgba(248, 249, 250, 0.12)',
  },
  // Trophy & Milestone Highlights
  gold: {
    DEFAULT: '#f59e0b', // Milestone runs, 100s, boundary 6s, trophies
    dark: '#d97706',    // Hover gold
    light: '#fbbf24',   // Highlight gold text
  },
  // Cricket Field & Status Colors
  status: {
    boundary4: '#10b981', // Emerald green for 4s
    boundary6: '#9333ea', // Purple for 6s
    wicket: '#dc2626',    // Red for wickets
    pitch: '#d4a373',     // Pitch clay color
    outfield: '#047857',  // Pitch outfield grass green
  },
} as const;

export const typography = {
  fontFamily: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],       // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],       // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],// 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
  },
  fontWeight: {
    normal: '400',
    semibold: '600',
    bold: '700',
    black: '900',
  },
} as const;

export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem',  // 8px
  md: '1rem',    // 16px
  lg: '1.5rem',  // 24px
  xl: '2rem',    // 32px
  '2xl': '3rem', // 48px
} as const;

export const borderRadius = {
  sm: '0.375rem', // 6px
  md: '0.5rem',  // 8px
  lg: '0.75rem', // 12px
  xl: '1rem',    // 16px
  '2xl': '1.5rem',// 24px
  full: '9999px',
} as const;

export const glassmorphism = {
  panel: {
    background: 'rgba(15, 27, 56, 0.75)',
    backdropFilter: 'blur(14px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
  },
  button: {
    background: 'rgba(27, 73, 152, 0.4)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
  },
} as const;
