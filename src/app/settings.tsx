import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppText } from '@/components/app-text';
import { BandSelector } from '@/components/band-selector';
import { Card } from '@/components/card';
import { DateInput } from '@/components/date-input';
import { LoadingScreen } from '@/components/loading-screen';
import { Screen } from '@/components/screen';
import { useAppState } from '@/context/AppProvider';
import { colors, radius, spacing } from '@/theme';
import type { LocalDate, TargetBand } from '@/types/models';
import {
  formatDateKeyForInput,
  isFutureDateKey,
  parseDateInput,
} from '@/utils/date';

export default function SettingsScreen() {
  const { state, dispatch } = useAppState();
  const profile = state.profile;
  const [band, setBand] = useState<TargetBand>(profile?.targetBand ?? 6.5);
  const [dateText, setDateText] = useState(
    formatDateKeyForInput(profile?.examDate ?? null),
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  if (!profile) {
    return <LoadingScreen />;
  }

  const handleBandChange = (value: TargetBand) => {
    setBand(value);
    setSaved(false);
  };

  const handleDateChange = (value: string) => {
    setDateText(value);
    setError(null);
    setSaved(false);
  };

  const handleSave = () => {
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

    dispatch({
      type: 'update-profile',
      patch: { targetBand: band, examDate },
      updatedAt: new Date().toISOString(),
    });
    setError(null);
    setSaved(true);
  };

  return (
    <Screen edges={['left', 'right']} contentStyle={{ paddingTop: spacing.sm }}>
      <Card style={{ gap: spacing.md }}>
        <View style={{ gap: spacing.xs }}>
          <AppText variant="subtitle">Banda objetivo</AppText>
          <AppText variant="small" color="textSecondary">
            Elige la banda que quieres alcanzar en el examen.
          </AppText>
        </View>
        <BandSelector value={band} onChange={handleBandChange} />
      </Card>

      <Card style={{ gap: spacing.md }}>
        <View style={{ gap: spacing.xs }}>
          <AppText variant="subtitle">Fecha del examen</AppText>
          <AppText variant="small" color="textSecondary">
            Es opcional. Si la defines, verás la cuenta regresiva en Inicio.
          </AppText>
        </View>
        <DateInput
          value={dateText}
          onChangeText={handleDateChange}
          onClear={() => handleDateChange('')}
          hasError={Boolean(error)}
        />
        <AppText variant="small" color={error ? 'danger' : 'textMuted'}>
          {error ?? 'Formato: DD/MM/AAAA. Debe ser una fecha futura.'}
        </AppText>
      </Card>

      <AppButton label="Guardar cambios" onPress={handleSave} />

      {saved ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            padding: spacing.md,
            borderRadius: radius.md,
            backgroundColor: colors.successSoft,
          }}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <AppText variant="smallStrong" color="successText">
            Cambios guardados.
          </AppText>
        </View>
      ) : null}

      <Card style={{ flexDirection: 'row', gap: spacing.md }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: radius.pill,
            backgroundColor: colors.primarySoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
        </View>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <AppText variant="subtitle">Tus datos</AppText>
          <AppText variant="small" color="textSecondary">
            Tus datos se guardan en este dispositivo. La autoevaluación de Writing es
            orientativa y no reemplaza una calificación oficial.
          </AppText>
        </View>
      </Card>

      <AppText variant="caption" color="textMuted" align="center">
        IELTS Daily · versión 1.0.0
      </AppText>
    </Screen>
  );
}
