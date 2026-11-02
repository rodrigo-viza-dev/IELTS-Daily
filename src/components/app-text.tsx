import { Text, type TextProps, type TextStyle } from 'react-native';

import { colors, typography, type AppColor, type TypographyVariant } from '@/theme';

type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: AppColor;
  align?: TextStyle['textAlign'];
};

export function AppText({
  variant = 'body',
  color = 'text',
  align,
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      style={[typography[variant], { color: colors[color], textAlign: align }, style]}
      {...rest}
    />
  );
}
