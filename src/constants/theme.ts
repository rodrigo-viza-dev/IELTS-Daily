import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#172033',
    background: '#F5F7FB',
    surface: '#FFFFFF',
    backgroundElement: '#EAF0FF',
    backgroundSelected: '#DDE7FF',
    textSecondary: '#667085',
    border: '#D8E0F0',
    primary: '#2457D6',
    accent: '#F59E0B',
  },
  dark: {
    text: '#F4F7FF',
    background: '#0D1424',
    surface: '#151F33',
    backgroundElement: '#1C2A46',
    backgroundSelected: '#293D68',
    textSecondary: '#AEB9CF',
    border: '#2D3B58',
    primary: '#84A9FF',
    accent: '#FBBF54',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'system-ui',
    serif: 'Georgia',
    rounded: 'system-ui',
    mono: 'ui-monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 10,
  medium: 16,
  large: 24,
} as const;

export const MaxContentWidth = 720;
