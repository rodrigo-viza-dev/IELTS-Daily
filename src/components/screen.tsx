import type { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
  type Edge,
} from 'react-native-safe-area-context';

import { colors, layout, spacing } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: Edge[];
};

export function Screen({
  children,
  footer,
  scroll = true,
  contentStyle,
  edges = ['top', 'left', 'right'],
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const paddingBottom = Math.max(insets.bottom, spacing.lg) + spacing.xxl;

  return (
    <SafeAreaView edges={edges} style={styles.safeArea}>
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom },
            contentStyle,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.flex, { paddingBottom }, contentStyle]}>
          {children}
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing.xl,
  },
});
