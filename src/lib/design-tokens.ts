// Design Tokens - 8px spacing rhythm
export const spacing = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
}

// Typography Scale
export const typography = {
  display: {
    size: '2.25rem',     // 36px
    weight: '700',
    lineHeight: '1.2',
  },
  h1: {
    size: '1.875rem',    // 30px
    weight: '700',
    lineHeight: '1.3',
  },
  h2: {
    size: '1.5rem',      // 24px
    weight: '600',
    lineHeight: '1.4',
  },
  h3: {
    size: '1.25rem',     // 20px
    weight: '600',
    lineHeight: '1.4',
  },
  body: {
    size: '1rem',        // 16px
    weight: '400',
    lineHeight: '1.5',
  },
  small: {
    size: '0.875rem',    // 14px
    weight: '400',
    lineHeight: '1.4',
  },
  tiny: {
    size: '0.75rem',     // 12px
    weight: '500',
    lineHeight: '1.3',
  },
}

// Semantic Color Tokens (theme-agnostic)
export const semanticColors = {
  // Status colors
  success: {
    light: '#10b981',    // Emerald-500
    dark: '#34d399',     // Emerald-400
  },
  warning: {
    light: '#f59e0b',    // Amber-500
    dark: '#fbbf24',     // Amber-400
  },
  danger: {
    light: '#ef4444',    // Red-500
    dark: '#f87171',     // Red-400
  },
  info: {
    light: '#3b82f6',    // Blue-500
    dark: '#60a5fa',     // Blue-400
  },
  
  // Tier badges
  warm: {
    bg: 'rgba(251, 146, 60, 0.15)',    // Orange
    border: 'rgba(251, 146, 60, 0.4)',
    text: '#fb923c',
  },
  hot: {
    bg: 'rgba(239, 68, 68, 0.15)',     // Red
    border: 'rgba(239, 68, 68, 0.4)',
    text: '#ef4444',
  },
  platinum: {
    bg: 'rgba(168, 85, 247, 0.15)',    // Purple
    border: 'rgba(168, 85, 247, 0.4)',
    text: '#a855f7',
  },
}

// Shadow Elevations
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
}

// Border Radius
export const borderRadius = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
}

// Transitions
export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
}

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

