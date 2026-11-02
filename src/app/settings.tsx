import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, View } from 'react-native';

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
  const { state, dispatch, resetState } = useAppState();
  const router = useRouter();
  const profile = state.profile;
  const [band, setBand] = useState<TargetBand>(profile?.targetBand ?? 6.5);
  const [dateText, setDateText] = useState(
    formatDateKeyForInput(profile?.examDate ?? null),
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await resetState();
      setDeleteVisible(false);
      router.replace('/onboarding');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
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
              backgroundColor: colors.warningSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="notifications-off-outline" size={20} color={colors.warning} />
          </View>
          <View style={{ flex: 1, gap: spacing.xs }}>
            <AppText variant="subtitle">Recordatorio diario</AppText>
            <AppText variant="small" color="textSecondary">
              Pendiente para el final. Esta versión prioriza la rutina, el progreso y el
              borrado seguro; los avisos locales se incorporarán cuando sean compatibles
              con el entorno de prueba.
            </AppText>
          </View>
        </Card>

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

        <Card style={{ gap: spacing.md }}>
          <View style={{ gap: spacing.xs }}>
            <AppText variant="subtitle">Zona de riesgo</AppText>
            <AppText variant="small" color="textSecondary">
              Borrar tus datos elimina el perfil, las palabras guardadas, los quizzes,
              los ensayos y la racha.
            </AppText>
          </View>
          <AppButton
            label="Borrar todos mis datos"
            variant="danger"
            onPress={() => setDeleteVisible(true)}
          />
        </Card>

        <AppText variant="caption" color="textMuted" align="center">
          IELTS Daily · versión 1.0.0
        </AppText>
      </Screen>

      <Modal
        visible={deleteVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteVisible(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.overlay,
            justifyContent: 'center',
            padding: spacing.xl,
          }}>
          <View
            style={{
              width: '100%',
              maxWidth: 420,
              alignSelf: 'center',
              backgroundColor: colors.surface,
              borderRadius: radius.xl,
              padding: spacing.xl,
              gap: spacing.md,
            }}>
            <AppText variant="heading">¿Borrar todos tus datos?</AppText>
            <AppText variant="small" color="textSecondary">
              Esta acción no se puede deshacer. Cancelar conserva todo tal como está.
            </AppText>
            <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
              <AppButton
                label="Cancelar"
                variant="secondary"
                onPress={() => setDeleteVisible(false)}
                disabled={deleting}
              />
              <AppButton
                label={deleting ? 'Borrando...' : 'Borrar todo'}
                variant="danger"
                onPress={handleDelete}
                disabled={deleting}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
