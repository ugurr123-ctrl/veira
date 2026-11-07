/**
 * Veira Nocturnal Sanctuary - Central Theme Engine
 * Controls visual resonance, background palettes, accents, and ambient glows across all tabs.
 */

export interface ThemeDefinition {
  id: string;
  name: string;
  subtitle: string;
  colors: [string, string, string];
  bgColor: string;          // Deep main backdrop
  surfaceColor: string;     // Card containers
  surfaceCardColor: string; // Inner pills / secondary modules
  accentHex: string;        // Active gold / teal / rose accent
  accentGlow: string;       // Radial glow for accents
  glow1: string;            // Top left ambient blob
  glow2: string;            // Middle right ambient blob
  glow3: string;            // Bottom left ambient blob
  textColor: string;        // Primary header text
  mutedColor: string;       // Body text / descriptions
}

export const VEIRA_THEMES: Record<string, ThemeDefinition> = {
  'nocturnal-serenity': {
    id: 'nocturnal-serenity',
    name: 'Nocturnal Serenity',
    subtitle: 'Gece Mavisi & Göksel Altın',
    colors: ['#080A16', '#161A30', '#F5D061'],
    bgColor: '#080a16',
    surfaceColor: '#161a30',
    surfaceCardColor: '#252840',
    accentHex: '#F5D061',
    accentGlow: 'rgba(245, 208, 97, 0.35)',
    glow1: 'rgba(27, 34, 82, 0.55)',
    glow2: 'rgba(32, 28, 56, 0.45)',
    glow3: 'rgba(231, 195, 85, 0.12)',
    textColor: '#dee0ff',
    mutedColor: '#c7c4d7',
  },
  'celestial-aurora': {
    id: 'celestial-aurora',
    name: 'Celestial Aurora',
    subtitle: 'Kuzey Işıkları & Mistik Turkuaz',
    colors: ['#050C18', '#0C1B2E', '#2DD4BF'],
    bgColor: '#050c18',
    surfaceColor: '#0c1b2e',
    surfaceCardColor: '#132845',
    accentHex: '#2DD4BF',
    accentGlow: 'rgba(45, 212, 191, 0.4)',
    glow1: 'rgba(13, 56, 64, 0.6)',
    glow2: 'rgba(67, 56, 202, 0.45)',
    glow3: 'rgba(45, 212, 191, 0.18)',
    textColor: '#e0f7f6',
    mutedColor: '#b0d5d3',
  },
  'golden-eclipse': {
    id: 'golden-eclipse',
    name: 'Golden Eclipse',
    subtitle: 'Sıcak Obsidiyen & Kraliyet Altını',
    colors: ['#0A0805', '#1C1610', '#D4AF37'],
    bgColor: '#0a0805',
    surfaceColor: '#1c1610',
    surfaceCardColor: '#2c2217',
    accentHex: '#D4AF37',
    accentGlow: 'rgba(212, 175, 55, 0.4)',
    glow1: 'rgba(61, 38, 12, 0.6)',
    glow2: 'rgba(43, 27, 8, 0.5)',
    glow3: 'rgba(212, 175, 55, 0.15)',
    textColor: '#fdf4dc',
    mutedColor: '#d6c8b2',
  },
  'velvet-cosmos': {
    id: 'velvet-cosmos',
    name: 'Velvet Cosmos',
    subtitle: 'Mistik Mürdüm & Kozmik Gül',
    colors: ['#0D0514', '#1E0C2B', '#EC4899'],
    bgColor: '#0d0514',
    surfaceColor: '#1e0c2b',
    surfaceCardColor: '#2d1440',
    accentHex: '#EC4899',
    accentGlow: 'rgba(236, 72, 153, 0.4)',
    glow1: 'rgba(59, 7, 100, 0.6)',
    glow2: 'rgba(74, 4, 78, 0.5)',
    glow3: 'rgba(236, 72, 153, 0.15)',
    textColor: '#fce7f3',
    mutedColor: '#d8b4e2',
  },
  'pure-oled': {
    id: 'pure-oled',
    name: 'Pure OLED Midnight',
    subtitle: 'Saf Siyah & Minimalist Yıldız',
    colors: ['#000000', '#0A0A0C', '#F5D061'],
    bgColor: '#000000',
    surfaceColor: '#0a0a0c',
    surfaceCardColor: '#15151a',
    accentHex: '#F5D061',
    accentGlow: 'rgba(245, 208, 97, 0.35)',
    glow1: 'rgba(15, 15, 20, 0.4)',
    glow2: 'rgba(20, 20, 30, 0.4)',
    glow3: 'rgba(245, 208, 97, 0.08)',
    textColor: '#ffffff',
    mutedColor: '#a1a1aa',
  },
  'day-light-sanctuary': {
    id: 'day-light-sanctuary',
    name: 'Ethereal Dawn',
    subtitle: 'Fildişi Zemin, Şampanya Altını & Mistik Lavanta',
    colors: ['#FDFAF6', '#FFFFFF', '#D4A017'],
    bgColor: '#fdfaf6',
    surfaceColor: '#ffffff',
    surfaceCardColor: '#f7f2ea',
    accentHex: '#d4a017',
    accentGlow: 'rgba(212, 160, 23, 0.25)',
    glow1: 'rgba(255, 223, 160, 0.16)',
    glow2: 'rgba(228, 222, 252, 0.20)',
    glow3: 'rgba(212, 160, 23, 0.08)',
    textColor: '#1d182e',
    mutedColor: '#4f4634',
  },
};

export const THEME_LIST = Object.values(VEIRA_THEMES);

/**
 * Gets currently active theme from storage or default
 */
export function getActiveThemeId(): string {
  try {
    return localStorage.getItem('veira_active_theme') || 'nocturnal-serenity';
  } catch {
    return 'nocturnal-serenity';
  }
}

/**
 * Gets currently active theme definition
 */
export function getActiveTheme(): ThemeDefinition {
  const id = getActiveThemeId();
  return VEIRA_THEMES[id] || VEIRA_THEMES['nocturnal-serenity'];
}

/**
 * Applies theme globally to CSS variables, document root, and dispatches change event
 */
export function applyTheme(themeId: string, customAccent?: string): ThemeDefinition {
  const theme = VEIRA_THEMES[themeId] || VEIRA_THEMES['nocturnal-serenity'];
  const accent = customAccent || theme.accentHex;
  const root = document.documentElement;

  // Set CSS Custom Properties
  root.style.setProperty('--theme-bg', theme.bgColor);
  root.style.setProperty('--theme-surface', theme.surfaceColor);
  root.style.setProperty('--theme-surface-card', theme.surfaceCardColor);
  root.style.setProperty('--theme-accent', accent);
  root.style.setProperty('--theme-accent-glow', theme.accentGlow);
  root.style.setProperty('--theme-glow1', theme.glow1);
  root.style.setProperty('--theme-glow2', theme.glow2);
  root.style.setProperty('--theme-glow3', theme.glow3);
  root.style.setProperty('--theme-text', theme.textColor);
  root.style.setProperty('--theme-muted', theme.mutedColor);

  // Set root background and text color immediately
  root.style.backgroundColor = theme.bgColor;
  document.body.style.backgroundColor = theme.bgColor;
  document.body.style.color = theme.textColor;

  try {
    localStorage.setItem('veira_active_theme', theme.id);
    if (customAccent) {
      localStorage.setItem('veira_custom_accent', customAccent);
    }
  } catch {
    // safe fallback
  }

  // Notify all listening components
  window.dispatchEvent(
    new CustomEvent('veira_theme_changed', {
      detail: { themeId: theme.id, theme, accent },
    })
  );

  return theme;
}
