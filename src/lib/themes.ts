// 2025 Trending Color Schemes for Professional Healthcare/Beauty Apps

export type ThemeName = 
  | 'clinical-teal'      // Current - Medical trust
  | 'midnight-purple'    // Luxury spa
  | 'rose-gold'          // Premium beauty
  | 'forest-sage'        // Natural wellness
  | 'cobalt-sky'         // Professional medical
  | 'sunset-coral'       // Warm & inviting
  | 'charcoal-mint'      // Modern minimalist
  | 'deep-ocean'         // Calm & trustworthy

export interface Theme {
  name: ThemeName
  displayName: string
  description: string
  colors: {
    primary: string           // Main brand color
    primaryHover: string      // Hover state
    primaryLight: string      // Light variant
    secondary: string         // Secondary accent
    background: string        // Gradient start
    backgroundEnd: string     // Gradient end
    cardBg: string           // Card background
    textPrimary: string      // Main text
    textSecondary: string    // Secondary text
  }
}

export const themes: Record<ThemeName, Theme> = {
  'clinical-teal': {
    name: 'clinical-teal',
    displayName: 'Clinical Teal',
    description: 'Professional & trustworthy medical aesthetic',
    colors: {
      primary: '#06b6d4',           // Cyan-500
      primaryHover: '#0891b2',      // Cyan-600
      primaryLight: '#67e8f9',      // Cyan-300
      secondary: '#0ea5e9',         // Sky-500
      background: '#0f172a',        // Slate-900
      backgroundEnd: '#1e293b',     // Slate-800
      cardBg: 'rgba(30, 41, 59, 0.6)',
      textPrimary: '#f8fafc',       // Slate-50
      textSecondary: '#cbd5e1',     // Slate-300
    }
  },

  'midnight-purple': {
    name: 'midnight-purple',
    displayName: 'Midnight Purple',
    description: 'Luxury spa experience with royal elegance',
    colors: {
      primary: '#a855f7',           // Purple-500
      primaryHover: '#9333ea',      // Purple-600
      primaryLight: '#c084fc',      // Purple-400
      secondary: '#ec4899',         // Pink-500
      background: '#1e1b4b',        // Indigo-950
      backgroundEnd: '#312e81',     // Indigo-900
      cardBg: 'rgba(49, 46, 129, 0.6)',
      textPrimary: '#faf5ff',       // Purple-50
      textSecondary: '#e9d5ff',     // Purple-200
    }
  },

  'rose-gold': {
    name: 'rose-gold',
    displayName: 'Rose Gold',
    description: 'Premium beauty with warm sophistication',
    colors: {
      primary: '#f43f5e',           // Rose-500
      primaryHover: '#e11d48',      // Rose-600
      primaryLight: '#fb7185',      // Rose-400
      secondary: '#f97316',         // Orange-500
      background: '#1c1917',        // Stone-900
      backgroundEnd: '#292524',     // Stone-800
      cardBg: 'rgba(41, 37, 36, 0.6)',
      textPrimary: '#fafaf9',       // Stone-50
      textSecondary: '#e7e5e4',     // Stone-200
    }
  },

  'forest-sage': {
    name: 'forest-sage',
    displayName: 'Forest Sage',
    description: 'Natural wellness and organic beauty',
    colors: {
      primary: '#10b981',           // Emerald-500
      primaryHover: '#059669',      // Emerald-600
      primaryLight: '#34d399',      // Emerald-400
      secondary: '#84cc16',         // Lime-500
      background: '#14532d',        // Green-950
      backgroundEnd: '#166534',     // Green-900
      cardBg: 'rgba(22, 101, 52, 0.6)',
      textPrimary: '#f0fdf4',       // Green-50
      textSecondary: '#d1fae5',     // Green-100
    }
  },

  'cobalt-sky': {
    name: 'cobalt-sky',
    displayName: 'Cobalt Sky',
    description: 'Professional medical with modern edge',
    colors: {
      primary: '#3b82f6',           // Blue-500
      primaryHover: '#2563eb',      // Blue-600
      primaryLight: '#60a5fa',      // Blue-400
      secondary: '#06b6d4',         // Cyan-500
      background: '#0c4a6e',        // Sky-950
      backgroundEnd: '#075985',     // Sky-900
      cardBg: 'rgba(7, 89, 133, 0.6)',
      textPrimary: '#f0f9ff',       // Sky-50
      textSecondary: '#bae6fd',     // Sky-200
    }
  },

  'sunset-coral': {
    name: 'sunset-coral',
    displayName: 'Sunset Coral',
    description: 'Warm & inviting beauty experience',
    colors: {
      primary: '#f97316',           // Orange-500
      primaryHover: '#ea580c',      // Orange-600
      primaryLight: '#fb923c',      // Orange-400
      secondary: '#fbbf24',         // Amber-400
      background: '#451a03',        // Amber-950
      backgroundEnd: '#78350f',     // Amber-900
      cardBg: 'rgba(120, 53, 15, 0.6)',
      textPrimary: '#fffbeb',       // Amber-50
      textSecondary: '#fef3c7',     // Amber-100
    }
  },

  'charcoal-mint': {
    name: 'charcoal-mint',
    displayName: 'Charcoal Mint',
    description: 'Modern minimalist with fresh accent',
    colors: {
      primary: '#14b8a6',           // Teal-500
      primaryHover: '#0d9488',      // Teal-600
      primaryLight: '#2dd4bf',      // Teal-400
      secondary: '#22d3ee',         // Cyan-400
      background: '#18181b',        // Zinc-900
      backgroundEnd: '#27272a',     // Zinc-800
      cardBg: 'rgba(39, 39, 42, 0.6)',
      textPrimary: '#fafafa',       // Zinc-50
      textSecondary: '#e4e4e7',     // Zinc-200
    }
  },

  'deep-ocean': {
    name: 'deep-ocean',
    displayName: 'Deep Ocean',
    description: 'Calm & trustworthy with depth',
    colors: {
      primary: '#0ea5e9',           // Sky-500
      primaryHover: '#0284c7',      // Sky-600
      primaryLight: '#38bdf8',      // Sky-400
      secondary: '#6366f1',         // Indigo-500
      background: '#020617',        // Slate-950
      backgroundEnd: '#0f172a',     // Slate-900
      cardBg: 'rgba(15, 23, 42, 0.6)',
      textPrimary: '#f8fafc',       // Slate-50
      textSecondary: '#cbd5e1',     // Slate-300
    }
  },
}

export function getTheme(themeName: ThemeName): Theme {
  return themes[themeName]
}

export function applyTheme(themeName: ThemeName) {
  const theme = getTheme(themeName)
  const root = document.documentElement
  
  // Apply CSS variables
  root.style.setProperty('--theme-primary', theme.colors.primary)
  root.style.setProperty('--theme-primary-hover', theme.colors.primaryHover)
  root.style.setProperty('--theme-primary-light', theme.colors.primaryLight)
  root.style.setProperty('--theme-secondary', theme.colors.secondary)
  root.style.setProperty('--theme-background', theme.colors.background)
  root.style.setProperty('--theme-background-end', theme.colors.backgroundEnd)
  root.style.setProperty('--theme-card-bg', theme.colors.cardBg)
  root.style.setProperty('--theme-text-primary', theme.colors.textPrimary)
  root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary)
  
  // Store preference
  if (typeof window !== 'undefined') {
    localStorage.setItem('clinic-theme', themeName)
  }
}

export function getStoredTheme(): ThemeName {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('clinic-theme') as ThemeName
    return stored || 'clinical-teal'
  }
  return 'clinical-teal'
}

