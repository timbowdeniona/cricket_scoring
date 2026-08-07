# Malpas Cricket Club (Cheshire) - Official Design System Specification

Welcome to the official **Malpas CC Design System**. This specification defines the visual tokens, color palettes, typography scale, component blueprints, layout grids, micro-interactions, and outdoor tablet usability guidelines for building and extending the Malpas Cricket Club web portal and live scoring app.

---

## 1. Brand Identity & Color Tokens

The visual palette is derived directly from the official Malpas CC crest ([`public/badge.jpg`](file:///home/timbowden/dev/cricket_scoring/public/badge.jpg)) and traditional club tie ([`design/tie.jpg`](file:///home/timbowden/dev/cricket_scoring/design/tie.jpg)).

### Core Color Palette

| Token Name | Hex Code | Purpose / Application |
| :--- | :--- | :--- |
| **`malpas-navy`** | `#050b18` | Primary page background & outdoor glare-reduction dark base |
| **`malpas-dark`** | `#0a1226` | Panel backgrounds, active table rows, container fills |
| **`malpas-card`** | `#0f1b38` | Glassmorphism card surfaces with 75% opacity |
| **`malpas-border`**| `#1a2e5c` | Card borders, dividers, subtle separators |
| **`malpas-blue`**  | `#1b4998` | M.D.S.C. Royal Blue primary brand accent, active tabs, buttons |
| **`malpas-royal`** | `#2563eb` | Hover states, active highlights, links |
| **`malpas-cream`** | `#f8f9fa` | Off-White primary typography & diagonal tie-stripe accents |
| **`malpas-gold`**  | `#f59e0b` | Milestones (100s, 50s), boundary 6s, trophies, highlights |
| **`malpas-grass`** | `#10b981` | Outfield grass green, 4s, victory badges |
| **`malpas-pitch`** | `#d4a373` | Pitch clay color in 2D pitch map |

### Semantic CSS Color Variables ([`src/theme/tokens.ts`](file:///home/timbowden/dev/cricket_scoring/src/theme/tokens.ts))
```css
:root {
  --malpas-navy: #050b18;
  --malpas-dark: #0a1226;
  --malpas-card: #0f1b38;
  --malpas-border: #1a2e5c;
  --malpas-blue: #1b4998;
  --malpas-royal: #2563eb;
  --malpas-cream: #f8f9fa;
  --malpas-gold: #f59e0b;
}
```

---

## 2. Typography Hierarchy

The design system uses system sans-serif fonts for optimal rendering performance across iOS, Android, and WebGL contexts, paired with tabular monospace fonts for live scoreboard digits.

| Level | Size | Weight | Usage |
| :--- | :--- | :--- | :--- |
| **Hero Title (H1)** | `2.25rem` (36px) | `900` (Black) | Club name in hero banner |
| **Section Header (H2)** | `1.5rem` (24px) | `700` (Bold) | Tab titles, modal titles |
| **Card Header (H3)** | `1.125rem` (18px) | `700` (Bold) | Player names, match titles |
| **Body Primary** | `0.875rem` (14px) | `400` (Regular) | General body text, table cells |
| **Small Caption** | `0.75rem` (12px) | `600` (SemiBold)| Field labels, timestamps, metadata |
| **Scoreboard Digits** | `1.875rem` (30px) | `900` (Black Mono)| Live runs, overs, wickets |

---

## 3. Glassmorphism & Visual Textures

### Glass Panels (`.glass-panel`)
Panels use backdrop blur and subtle white borders for a modern, tactile depth:
```css
.glass-panel {
  background: rgba(15, 27, 56, 0.75);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

### Traditional Tie Stripe Pattern (`.tie-stripe-bg`)
Inspired by the diagonal cream stripes of `design/tie.jpg`:
```css
.tie-stripe-bg {
  background-image: repeating-linear-gradient(
    135deg,
    rgba(248, 249, 250, 0.04),
    rgba(248, 249, 250, 0.04) 12px,
    transparent 12px,
    transparent 32px
  );
}
```

---

## 4. Outdoor Tablet & Usability Specifications

Because this app is used outdoors on tablets during matches:
1. **Minimum Touch Target**: All keypad buttons, strikers, and bowlers have a minimum touch height of `48px` to prevent accidental mis-taps.
2. **High-Contrast Dark Mode**: Pure `#050b18` dark background reduces sun glare on outdoor screens compared to pure black or light themes.
3. **No Vertical Scroll Roster Grid**: Team rosters render in a non-scrolling 3-column grid (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3`) so all 11 players are visible at once.

---

## 5. Component Patterns

### Buttons & Controls
- **Primary Action**: `bg-malpas-blue hover:bg-blue-600 text-white font-bold rounded-xl`
- **Secondary Action**: `bg-malpas-navy/80 border border-malpas-blue/30 text-gray-300`
- **Scoring Keypad Button**: `h-14 bg-malpas-navy border border-malpas-blue/40 font-mono text-xl font-bold rounded-xl`
- **Dismissal Button**: `bg-red-950/80 border border-red-500/40 text-red-200`

### Micro-Animations
- **Active Pulse (`.animate-active-pulse`)**: Applied to active striker and current bowler indicators.
- **Wicket Bounce**: Dismissal indicators trigger a quick spring animation.
- **Tab Scale**: Selected tabs scale by `1.02` with drop shadow.

---

## 6. Implementation Reference

All components MUST source color utility classes from `tailwind.config.ts` and imports from `src/theme/tokens.ts`.
