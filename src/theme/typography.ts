import type { TextStyle } from 'react-native';

export const typography = {
  display: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heading: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodyStrong: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  smallStrong: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  number: {
    fontSize: 44,
    lineHeight: 50,
    fontWeight: '800',
    letterSpacing: -1,
  },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
