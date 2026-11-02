import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppText } from '@/components/app-text';
import { BandSelector } from '@/components/band-selector';
import { DateInput } from '@/components/date-input';
import { Pill } from '@/components/pill';
import { Screen } from '@/components/screen';
import { useAppState } from '@/context/AppProvider';
import { colors, spacing } from '@/theme';
import type { LocalDate, TargetBand } from '@/types/models';
import { formatBand } from '@/utils/band';
import { isFutureDateKey, parseDateInput } from '@/utils/date';

export default function OnboardingScreen() {
  const { dispatch } = useAppState();
  const router = useRouter();
  const [band, setBand] = useState<TargetBand>(6.5);
  const [dateText, setDateText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleDateChange = (value: string) => {
    setDateText(value);
    if (error) {
      setError(null);
    }
  };

  const handleStart = () => {
    let examDate: LocalDate | null = null;

    if (dateText.trim().length > 0) {
      const parsedDate = parseDateInput(dateText);

      if (!parsedDate) {
        setError('Escribe una fecha válida en formato DD/MM/AAAA.');
        return;
      }

      if (!isFutureDateKey(parsedDate)) {
        setError('La fecha del examen debe ser posterior a hoy.');
        return;
      }

      examDate = parsedDate;
    }

    const now = new Date().toISOString();

    dispatch({
      type: 'create-profile',
      profile: {
        targetBand: band,
        examDate,
        reminderEnabled: false,
        reminderTime: '20:00',
        createdAt: now,
        updatedAt: now,
      },
    });
    router.replace('/');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen
        contentStyle={{ paddingTop: spacing.xxl }}
        footer={
          <View style={{ gap: spacing.md }}>
            <AppButton label="Empezar" onPress={handleStart} />
            <AppText variant="caption" color="textMuted" align="center">
              Tus datos se guardan solo en este dispositivo.
            </AppText>
          </View>
        }>
        <Pill label="IELTS Daily" tone="primary" />

        <View style={{ gap: spacing.sm }}>
          <AppText variant="title" style={{ fontSize: 34, lineHeight: 40 }}>
            ¿Qué banda quieres lograr?
          </AppText>
          <AppText color="textSecondary">
            Con tu meta armamos una rutina corta para cada día.
          </AppText>
        </View>

        <BandSelector value={band} onChange={setBand} />

        <View style={{ gap: spacing.sm }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.sm,
            }}>
            <AppText variant="subtitle">Fecha de tu examen</AppText>
            <AppText variant="caption" color="textMuted">
              OPCIONAL
            </AppText>
          </View>
          <DateInput
            value={dateText}
            onChangeText={handleDateChange}
            onClear={() => handleDateChange('')}
            hasError={Boolean(error)}
          />
          <AppText variant="small" color={error ? 'danger' : 'textSecondary'}>
            {error ?? 'La usaré para mostrar cuántos días faltan.'}
          </AppText>
        </View>

        <AppText variant="small" color="textSecondary">
          Banda objetivo seleccionada: {formatBand(band)}
        </AppText>
      </Screen>
    </KeyboardAvoidingView>
  );
}
