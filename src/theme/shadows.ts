import { Platform, type ViewStyle } from 'react-native';

export const shadows = {
  card: Platform.select<ViewStyle>({
    web: {
      boxShadow: '0 1px 3px rgba(16, 24, 40, 0.06)',
    },
    default: {
      shadowColor: '#101828',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 1,
    },
  }),
  floating: Platform.select<ViewStyle>({
    web: {
      boxShadow: '0 8px 24px rgba(16, 24, 40, 0.12)',
    },
    default: {
      shadowColor: '#101828',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 6,
    },
  }),
} as const;
