import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { useAppState } from '@/context/AppProvider';
import { colors, radius, spacing } from '@/theme';
import { calculateStreaks } from '@/utils/activity';
import { formatBand } from '@/utils/band';
import {
  addDaysToKey,
  formatDayMonthShort,
  todayKey,
  toLocalDateKey,
  weekdayInitial,
} from '@/utils/date';

export default function ProgressScreen() {
  const { state } = useAppState();
  const today = todayKey();
  const profile = state.profile;
  const streak = calculateStreaks(state.dailyActivities, today);
  const savedWords = state.words.filter((word) => word.isSaved).length;
  const quizzes = state.quizResults.length;
  const completedEssays = state.essays.filter((essay) => essay.completedAt !== null);
  const hasData = savedWords + quizzes + completedEssays.length > 0 || streak.longest > 0;

  const metrics = [
    { label: 'Racha actual', value: streak.current },
    { label: 'Racha máxima', value: streak.longest },
    { label: 'Palabras', value: savedWords },
    { label: 'Quizzes', value: quizzes },
    { label: 'Ensayos', value: completedEssays.length },
  ];

  const week = Array.from({ length: 7 }, (_, index) => {
    const date = addDaysToKey(today, index - 6);
    const activity = state.dailyActivities.find((entry) => entry.date === date);
    const count = activity
      ? [activity.wordOfDay, activity.quiz, activity.writing].filter(Boolean).length
      : 0;

    return { date, count, isToday: date === today };
  });
  const weekTotal = week.reduce((total, day) => total + day.count, 0);

  const essays = completedEssays
    .filter((essay) => essay.overallBand !== null)
    .sort((left, right) => (left.completedAt ?? '').localeCompare(right.completedAt ?? ''))
    .slice(-6);
  const essayAverage =
    essays.length > 0
      ? essays.reduce((total, essay) => total + (essay.overallBand ?? 0), 0) / essays.length
      : null;

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

      <Card style={{ gap: spacing.md }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: spacing.sm,
          }}>
          <View style={{ gap: spacing.xs }}>
            <AppText variant="subtitle">Actividad semanal</AppText>
            <AppText variant="small" color="textSecondary">
              Tareas completadas en los últimos 7 días.
            </AppText>
          </View>
          <AppText variant="smallStrong" color="primary">
            {weekTotal}
          </AppText>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: spacing.sm,
            height: 132,
          }}>
          {week.map((day) => {
            const barHeight = day.count === 0 ? 6 : Math.max(14, (day.count / 3) * 104);

            return (
              <View
                key={day.date}
                accessibilityLabel={`${day.date}: ${day.count} tareas completadas`}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: spacing.xs }}>
                <AppText variant="caption" color={day.count > 0 ? 'textSecondary' : 'textMuted'}>
                  {day.count}
                </AppText>
                <View
                  style={{
                    width: '70%',
                    maxWidth: 28,
                    height: barHeight,
                    borderRadius: radius.sm,
                    backgroundColor:
                      day.count === 0
                        ? colors.border
                        : day.isToday
                          ? colors.primary
                          : colors.primaryMuted,
                  }}
                />
                <AppText
                  variant="caption"
                  color={day.isToday ? 'primary' : 'textMuted'}>
                  {weekdayInitial(day.date)}
                </AppText>
              </View>
            );
          })}
        </View>

        {weekTotal === 0 ? (
          <AppText variant="small" color="textMuted">
            Aún no hay actividad esta semana. Completa una tarea para empezar.
          </AppText>
        ) : null}
      </Card>

      <Card style={{ gap: spacing.md }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: spacing.sm,
          }}>
          <View style={{ gap: spacing.xs }}>
            <AppText variant="subtitle">Banda en tus ensayos</AppText>
            <AppText variant="small" color="textSecondary">
              Promedio autoestimado de tus últimos ensayos.
            </AppText>
          </View>
          {profile ? (
            <AppText variant="smallStrong" color="textSecondary">
              Meta {formatBand(profile.targetBand)}
            </AppText>
          ) : null}
        </View>

        {essays.length === 0 ? (
          <AppText variant="small" color="textMuted">
            Aún no hay ensayos autoevaluados. Termina un Writing para ver tu evolución.
          </AppText>
        ) : (
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                gap: spacing.sm,
                height: 150,
              }}>
              {essays.map((essay) => {
                const band = essay.overallBand ?? 0;
                const barHeight = Math.max(10, (band / 9) * 112);

                return (
                  <View
                    key={essay.id}
                    accessibilityLabel={`Ensayo ${formatBand(band)}`}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: spacing.xs,
                    }}>
                    <AppText variant="caption" color="textSecondary">
                      {formatBand(band)}
                    </AppText>
                    <View
                      style={{
                        width: '68%',
                        maxWidth: 30,
                        height: barHeight,
                        borderRadius: radius.sm,
                        backgroundColor: colors.primary,
                      }}
                    />
                    <AppText variant="caption" color="textMuted">
                      {essay.completedAt
                        ? formatDayMonthShort(toLocalDateKey(new Date(essay.completedAt)))
                        : ''}
                    </AppText>
                  </View>
                );
              })}
            </View>
            {essayAverage !== null ? (
              <AppText variant="small" color="textSecondary">
                Promedio de estos ensayos: {formatBand(essayAverage)}. Recuerda que es una
                autoestimación orientativa.
              </AppText>
            ) : null}
          </>
        )}
      </Card>
    </Screen>
  );
}
