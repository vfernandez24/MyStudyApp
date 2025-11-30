import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

// Tipo de objeto para cada recordatorio
export type Reminder = {
  id: string;     // identificador único
  title: string;  // título de la notificación
  body: string;   // texto de la notificación
  date: string;   // fecha en formato ISO (ej: "2025-09-20T15:00:00")
};

// Clave para AsyncStorage
const STORAGE_KEY = "reminders";

// 🔹 Guardar recordatorios en AsyncStorage
export async function saveReminders(reminders: Reminder[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}

// 🔹 Leer recordatorios desde AsyncStorage
export async function loadReminders(): Promise<Reminder[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// 🔹 Resetear notificaciones en base a los recordatorios guardados
export async function resetNotificationsFromStorage() {
  const reminders = await loadReminders();

  // cancelar todas las previas
  await Notifications.cancelAllScheduledNotificationsAsync();

  // programar nuevas
  for (let reminder of reminders) {
    const triggerDate = new Date(reminder.date);
    const now = new Date();
    if (triggerDate > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: reminder.title,
          body: reminder.body,
          data: { id: reminder.id },
        },
        trigger: triggerDate as any,
      });
    }
  }
}

// 🔹 Añadir un nuevo recordatorio y reprogramar notificaciones
export async function addReminder(reminder: Reminder) {
  const reminders = await loadReminders();
  reminders.push(reminder);
  await saveReminders(reminders);
  await resetNotificationsFromStorage();
}

// 🔹 Eliminar un recordatorio y reprogramar notificaciones
export async function removeReminder(id: string) {
  const reminders = await loadReminders();
  const filtered = reminders.filter(r => r.id !== id);
  await saveReminders(filtered);
  await resetNotificationsFromStorage();
}
