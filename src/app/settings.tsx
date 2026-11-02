import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Switch,
  TextInput,
  View,
} from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppText } from '@/components/app-text';
import { BandSelector } from '@/components/band-selector';
import { Card } from '@/components/card';
import { DateInput } from '@/components/date-input';
import { LoadingScreen } from '@/components/loading-screen';
import { Screen } from '@/components/screen';
import { useAppState } from '@/context/AppProvider';
import { colors, radius, spacing, typography } from '@/theme';
import type { LocalDate, TargetBand } from '@/types/models';
import {
  formatDateKeyForInput,
  formatTimeLabel,
  isFutureDateKey,
  parseDateInput,
} from '@/utils/date';
import {
  cancelDailyReminder,
  notificationsSupported,
  scheduleDailyReminder,
} from '@/utils/notifications';

function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function formatTimeInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  return digits.length <= 2 ? digits : `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function reminderErrorMessage(reason: 'permission' | 'unsupported' | 'web') {
  if (reason === 'permission') {
    return 'No hay permiso para las notificaciones. Actívalo en los ajustes del sistema.';
  }

  if (reason === 'web') {
    return 'Los recordatorios locales no están disponibles en la versión web.';
  }

  return 'No se pudo programar el recordatorio. Puede requerir un development build en Android o iOS.';
}

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
  const [reminderEnabled, setReminderEnabled] = useState(
    profile?.reminderEnabled ?? false,
  );
  const [reminderTime, setReminderTime] = useState(profile?.reminderTime ?? '20:00');
  const [reminderBusy, setReminderBusy] = useState(false);
  const [reminderMessage, setReminderMessage] = useState<string | null>(null);
  const [reminderError, setReminderError] = useState<string | null>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!profile) {
    return <LoadingScreen />;
  }

  const persistReminder = (enabled: boolean, time: string) => {
    dispatch({
      type: 'update-profile',
      patch: { reminderEnabled: enabled, reminderTime: time },
      updatedAt: new Date().toISOString(),
    });
  };

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

  const handleReminderToggle = async (value: boolean) => {
    setReminderError(null);
    setReminderMessage(null);

    if (!value) {
      setReminderBusy(true);
      await cancelDailyReminder();
      setReminderBusy(false);
      setReminderEnabled(false);
      persistReminder(false, reminderTime);
      setReminderMessage('Recordatorio desactivado.');
      return;
    }

    if (!isValidTime(reminderTime)) {
      setReminderError('Usa una hora válida en formato HH:MM, por ejemplo 20:00.');
      return;
    }

    setReminderBusy(true);
    const result = await scheduleDailyReminder(reminderTime);
    setReminderBusy(false);

    if (!result.ok) {
      setReminderEnabled(false);
      persistReminder(false, reminderTime);
      setReminderError(reminderErrorMessage(result.reason));
      return;
    }

    setReminderEnabled(true);
    persistReminder(true, reminderTime);
    setReminderMessage(`Recordatorio activo a las ${formatTimeLabel(reminderTime)}.`);
  };

  const handleUpdateReminderTime = async () => {
    setReminderError(null);
    setReminderMessage(null);

    if (!isValidTime(reminderTime)) {
      setReminderError('Usa una hora válida en formato HH:MM, por ejemplo 20:00.');
      return;
    }

    setReminderBusy(true);
    const result = await scheduleDailyReminder(reminderTime);
    setReminderBusy(false);

    if (!result.ok) {
      setReminderEnabled(false);
      persistReminder(false, reminderTime);
      setReminderError(reminderErrorMessage(result.reason));
      return;
    }

    persistReminder(reminderEnabled, reminderTime);
    setReminderMessage(`Hora actualizada a las ${formatTimeLabel(reminderTime)}.`);
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await cancelDailyReminder();
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

        <Card style={{ gap: spacing.md }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.md,
            }}>
            <View style={{ flex: 1, gap: spacing.xs }}>
              <AppText variant="subtitle">Recordatorio diario</AppText>
              <AppText variant="small" color="textSecondary">
                Un aviso local para no perder la racha.
              </AppText>
            </View>
            {reminderBusy ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Switch
                accessibilityLabel="Activar recordatorio diario"
                value={notificationsSupported && reminderEnabled}
                onValueChange={handleReminderToggle}
                disabled={!notificationsSupported}
                trackColor={{ false: colors.borderStrong, true: colors.primary }}
                thumbColor={colors.white}
              />
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.md,
            }}>
            <AppText variant="small" color="textSecondary">
              Hora
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <TextInput
                value={reminderTime}
                onChangeText={(value) => {
                  setReminderTime(formatTimeInput(value));
                  setReminderError(null);
                  setReminderMessage(null);
                }}
                keyboardType="number-pad"
                maxLength={5}
                accessibilityLabel="Hora del recordatorio"
                style={{
                  width: 96,
                  height: 44,
                  borderRadius: radius.sm,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  textAlign: 'center',
                  ...typography.body,
                  color: colors.text,
                }}
              />
              {reminderEnabled ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Actualizar hora del recordatorio"
                  onPress={handleUpdateReminderTime}
                  disabled={reminderBusy}
                  style={({ pressed }) => ({
                    minHeight: 44,
                    justifyContent: 'center',
                    paddingHorizontal: spacing.sm,
                    opacity: pressed ? 0.7 : 1,
                  })}>
                  <AppText variant="smallStrong" color="primary">
                    Actualizar
                  </AppText>
                </Pressable>
              ) : null}
            </View>
          </View>

          {!notificationsSupported ? (
            <AppText variant="small" color="warningText">
              Los recordatorios locales no están disponibles en la versión web. Usa un
              development build en Android o iOS.
            </AppText>
          ) : null}

          {reminderError ? (
            <AppText variant="small" color="danger">
              {reminderError}
            </AppText>
          ) : reminderMessage ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.sm,
                padding: spacing.md,
                borderRadius: radius.md,
                backgroundColor: colors.successSoft,
              }}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <AppText variant="smallStrong" color="successText" style={{ flex: 1 }}>
                {reminderMessage}
              </AppText>
            </View>
          ) : (
            <AppText variant="small" color="textMuted">
              El permiso se solicita solo al activar el recordatorio. En Expo Go puede requerir un development build.
            </AppText>
          )}
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
