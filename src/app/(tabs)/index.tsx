import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Card } from '@/components/card';
import { IconButton } from '@/components/icon-button';
import { LoadingScreen } from '@/components/loading-screen';
import { ProgressBar } from '@/components/progress-bar';
import { Screen } from '@/components/screen';
import { TaskRow } from '@/components/task-row';
import { useAppState } from '@/context/AppProvider';
import { colors, radius, spacing } from '@/theme';
import { calculateStreaks } from '@/utils/activity';
import { formatBand } from '@/utils/band';
import {
  formatLongDate,
  formatShortDateKey,
  signedDaysUntilDate,
  todayKey,
} from '@/utils/date';
import { getWordOfDay } from '@/utils/word-of-day';

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Buenos días';
  }

  if (hour < 19) {
    return 'Buenas tardes';
  }

  return 'Buenas noches';
}

export default function HomeScreen() {
  const { state } = useAppState();
  const router = useRouter();
  const profile = state.profile;

  if (!profile) {
    return <LoadingScreen />;
  }

  const today = todayKey();
  const activity = state.dailyActivities.find((entry) => entry.date === today);
  const doneCount = [activity?.wordOfDay, activity?.quiz, activity?.writing].filter(
    Boolean,
  ).length;
  const streak = calculateStreaks(state.dailyActivities, today);
  const wordOfDay = getWordOfDay(state.words, today);
  const signedDays = profile.examDate ? signedDaysUntilDate(profile.examDate) : null;
  const upcomingDays = signedDays !== null && signedDays >= 0 ? signedDays : null;
  const examPassed = signedDays !== null && signedDays < 0;

  return (
    <Screen>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: spacing.md,
        }}>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <AppText variant="small" color="textSecondary">
            {formatLongDate()}
          </AppText>
          <AppText variant="title">{getGreeting()}</AppText>
        </View>
        <IconButton
          icon="settings-outline"
          label="Abrir ajustes"
          onPress={() => router.push('/settings')}
        />
      </View>

      <View
        style={{
          backgroundColor: colors.primary,
          borderRadius: radius.xl,
          padding: spacing.xl,
          gap: spacing.sm,
        }}>
        {upcomingDays !== null && profile.examDate ? (
          <>
            <AppText variant="small" color="white" style={{ opacity: 0.85 }}>
              {upcomingDays === 0 ? 'Tu examen es hoy' : 'Faltan para tu examen'}
            </AppText>
            {upcomingDays > 0 ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  gap: spacing.sm,
                }}>
                <AppText
                  variant="display"
                  color="white"
                  style={{ fontSize: 58, lineHeight: 62 }}>
                  {upcomingDays}
                </AppText>
                <AppText
                  variant="subtitle"
                  color="white"
                  style={{ marginBottom: spacing.sm }}>
                  días
                </AppText>
              </View>
            ) : null}
            <AppText variant="bodyStrong" color="white">
              Banda objetivo: {formatBand(profile.targetBand)}
            </AppText>
            <AppText variant="small" color="white" style={{ opacity: 0.8 }}>
              {formatShortDateKey(profile.examDate)}
            </AppText>
          </>
        ) : (
          <>
            <AppText variant="small" color="white" style={{ opacity: 0.85 }}>
              {examPassed ? 'Fecha de examen alcanzada' : 'Cuenta regresiva'}
            </AppText>
            <AppText variant="heading" color="white">
              {examPassed ? 'Actualiza tu fecha' : 'Sin fecha de examen'}
            </AppText>
            <AppText variant="small" color="white" style={{ opacity: 0.85 }}>
              {examPassed
                ? 'La fecha guardada ya pasó. Puedes cambiarla en Ajustes.'
                : 'Agrega una fecha en Ajustes para ver cuántos días faltan.'}
            </AppText>
            <View style={{ marginTop: spacing.xs }}>
              <AppText
                variant="smallStrong"
                color="white"
                onPress={() => router.push('/settings')}
                accessibilityRole="button"
                accessibilityLabel="Ir a Ajustes para configurar la fecha del examen"
                style={{ textDecorationLine: 'underline' }}>
                Configurar en Ajustes
              </AppText>
            </View>
            <AppText
              variant="bodyStrong"
              color="white"
              style={{ marginTop: spacing.sm }}>
              Banda objetivo: {formatBand(profile.targetBand)}
            </AppText>
          </>
        )}
      </View>

      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: radius.pill,
            backgroundColor: colors.warningSoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="flame" size={22} color={colors.warning} />
        </View>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <AppText variant="small" color="textSecondary">
            Racha actual
          </AppText>
          <AppText variant="heading">
            {streak.current} {streak.current === 1 ? 'día' : 'días'}
          </AppText>
        </View>
        <View style={{ alignItems: 'flex-end', gap: spacing.xs }}>
          <AppText variant="caption" color="textMuted">
            MÁXIMA
          </AppText>
          <AppText variant="subtitle">{streak.longest}</AppText>
        </View>
      </Card>

      <View style={{ gap: spacing.sm }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <AppText variant="heading">Tareas de hoy</AppText>
          <AppText variant="smallStrong" color="textSecondary">
            {doneCount} de 3
          </AppText>
        </View>
        <ProgressBar value={doneCount / 3} />
      </View>

      <View style={{ gap: spacing.md }}>
        <TaskRow
          title="Palabra del día"
          subtitle={`${wordOfDay?.term ?? 'Vocabulario académico'} · 2 min`}
          done={Boolean(activity?.wordOfDay)}
          onPress={() => router.push('/vocabulary')}
        />
        <TaskRow
          title="Quiz de repaso"
          subtitle="5 preguntas · 3 min"
          done={Boolean(activity?.quiz)}
          onPress={() => router.push('/quiz')}
        />
        <TaskRow
          title="Writing Task 2"
          subtitle="40 minutos"
          done={Boolean(activity?.writing)}
          onPress={() => router.push('/writing')}
        />
      </View>
    </Screen>
  );
}
