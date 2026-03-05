// OFFHOOK — Notification Service
// Local push notifications for follow-up reminders

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handling (native only)
if (Platform.OS !== 'web') {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
}

export async function requestNotificationPermission(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return false;
        }

        // Android channel setup
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('excuse-reminders', {
                name: 'Excuse Reminders',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#6C63FF',
            });
        }

        return true;
    } catch (error) {
        console.warn('Notification permission error:', error);
        return false;
    }
}

export async function scheduleFollowUpReminder(
    excuseId: string,
    followUpText: string,
    delayMinutes: number = 60
): Promise<string | null> {
    try {
        const hasPermission = await requestNotificationPermission();
        if (!hasPermission) return null;

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: '🎯 Time for your follow-up!',
                body: followUpText,
                data: { excuseId, type: 'follow_up' },
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: delayMinutes * 60,
            },
        });

        return notificationId;
    } catch (error) {
        console.warn('Failed to schedule follow-up notification:', error);
        return null;
    }
}

export async function scheduleSendTimeReminder(
    excuseId: string,
    excusePreview: string,
    delayMinutes: number = 5
): Promise<string | null> {
    try {
        const hasPermission = await requestNotificationPermission();
        if (!hasPermission) return null;

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: '⏰ Best time to send your excuse!',
                body: excusePreview.substring(0, 100) + '...',
                data: { excuseId, type: 'send_time' },
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: delayMinutes * 60,
            },
        });

        return notificationId;
    } catch (error) {
        console.warn('Failed to schedule send-time notification:', error);
        return null;
    }
}

export async function cancelNotification(notificationId: string): Promise<void> {
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
        console.warn('Failed to cancel notification:', error);
    }
}
