import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const notificationsSupported = Platform.OS !== 'web';

export type ReminderResult =
  | { ok: true }
  | { ok: false; reason: 'permission' | 'unsupported' | 'web' };

export function configureNotifications(): void {
  if (!notificationsSupported) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function scheduleDailyReminder(time: string): Promise<ReminderResult> {
  if (!notificationsSupported) {
    return { ok: false, reason: 'web' };
  }

  const [hour, minute] = time.split(':').map(Number);

  if (!Number.isInteger(hour) || !Number.isInteger(minute)) {
    return { ok: false, reason: 'unsupported' };
  }

  try {
    const current = await Notifications.getPermissionsAsync();
    let status = current.status;

    if (status !== 'granted') {
      const requested = await Notifications.requestPermissionsAsync();
      status = requested.status;
    }

    if (status !== 'granted') {
      return { ok: false, reason: 'permission' };
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-reminder', {
        name: 'Recordatorio diario',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'IELTS Daily',
        body: 'Es momento de tu práctica diaria.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: Platform.OS === 'android' ? 'daily-reminder' : undefined,
      },
    });

    return { ok: true };
  } catch {
    return { ok: false, reason: 'unsupported' };
  }
}

export async function cancelDailyReminder(): Promise<void> {
  if (!notificationsSupported) {
    return;
  }

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // Si el entorno no expone notificaciones, no hay nada que cancelar.
  }
}
