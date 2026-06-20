export type ThemeName = 'purple-night' | 'ocean-deep' | 'emerald-matrix' | 'rose-quartz' | 'sunset-blaze' | 'cyber-neon';

export interface ThemeDefinition {
  name: string;
  primary: string;
  primaryHover: string;
  accent: string;
  glow: string;
  bgGradient: string;
}

export const themes: Record<ThemeName, ThemeDefinition> = {
  'purple-night': {
    name: 'Purple Night',
    primary: '#7C3AED',
    primaryHover: '#6D28D9',
    accent: '#A855F7',
    glow: 'rgba(124, 58, 237, 0.35)',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(99,102,241,0.10) 0%, transparent 60%)',
  },
  'ocean-deep': {
    name: 'Ocean Deep',
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    accent: '#06B6D4',
    glow: 'rgba(37, 99, 235, 0.35)',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(6,182,212,0.10) 0%, transparent 60%)',
  },
  'emerald-matrix': {
    name: 'Emerald Matrix',
    primary: '#059669',
    primaryHover: '#047857',
    accent: '#10B981',
    glow: 'rgba(5, 150, 105, 0.35)',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(5,150,105,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(16,185,129,0.10) 0%, transparent 60%)',
  },
  'rose-quartz': {
    name: 'Rose Quartz',
    primary: '#E11D48',
    primaryHover: '#BE123C',
    accent: '#F472B6',
    glow: 'rgba(225, 29, 72, 0.35)',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(225,29,72,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(244,114,182,0.10) 0%, transparent 60%)',
  },
  'sunset-blaze': {
    name: 'Sunset Blaze',
    primary: '#EA580C',
    primaryHover: '#C2410C',
    accent: '#F59E0B',
    glow: 'rgba(234, 88, 12, 0.35)',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(234,88,12,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(245,158,11,0.10) 0%, transparent 60%)',
  },
  'cyber-neon': {
    name: 'Cyber Neon',
    primary: '#06B6D4',
    primaryHover: '#0891B2',
    accent: '#D946EF',
    glow: 'rgba(6, 182, 212, 0.35)',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(6,182,212,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(217,70,239,0.10) 0%, transparent 60%)',
  }
};
