import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { useAppState } from '@/context/AppProvider';
import { colors, radius, spacing } from '@/theme';
import { calculateStreaks } from '@/utils/activity';
import { todayKey } from '@/utils/date';

export default function ProgressScreen() {
  const { state } = useAppState();
  const today = todayKey();
  const streak = calculateStreaks(state.dailyActivities, today);
  const savedWords = state.words.filter((word) => word.isSaved).length;
  const quizzes = state.quizResults.length;
  const essays = state.essays.filter((essay) => essay.completedAt !== null).length;
  const hasData = savedWords + quizzes + essays > 0 || streak.longest > 0;

  const metrics = [
    { label: 'Racha actual', value: streak.current },
    { label: 'Racha máxima', value: streak.longest },
    { label: 'Palabras', value: savedWords },
    { label: 'Quizzes', value: quizzes },
    { label: 'Ensayos', value: essays },
  ];

  return (
    <Screen>
      <View style={{ gap: spacing.xs }}>
        <AppText variant="title">Tu progreso</AppText>
        <AppText color="textSecondary">
          Constancia y práctica registradas en este dispositivo.
        </AppText>
      </View>

      {!hasData ? (
        <Card style={{ alignItems: 'center', gap: spacing.sm }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: radius.pill,
              backgroundColor: colors.primarySoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="bar-chart-outline" size={24} color={colors.primary} />
          </View>
          <AppText variant="bodyStrong" align="center">
            Tu progreso empieza con tu primera actividad
          </AppText>
          <AppText variant="small" color="textSecondary" align="center">
            Guarda una palabra, completa un quiz o termina un ensayo para ver tus datos
            aquí.
          </AppText>
        </Card>
      ) : null}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
        {metrics.map((metric) => (
          <Card
            key={metric.label}
            style={{
              width: '47%',
              flexGrow: 1,
              alignItems: 'center',
              gap: spacing.xs,
            }}>
            <AppText variant="heading" color="primary">
              {metric.value}
            </AppText>
            <AppText variant="small" color="textSecondary" align="center">
              {metric.label}
            </AppText>
          </Card>
        ))}
      </View>

      <Card style={{ gap: spacing.sm }}>
        <AppText variant="subtitle">Actividad semanal</AppText>
        <AppText variant="small" color="textSecondary">
          El gráfico de los últimos siete días y la evolución de tus ensayos se
          habilitarán en la siguiente fase.
        </AppText>
      </Card>
    </Screen>
  );
}
