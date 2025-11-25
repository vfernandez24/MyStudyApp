import STORAGE_KEYS from "@/constants/storageKeys";
import { event } from "@/constants/types";
import { dateToStore } from "@/helpers/dateHelpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getEvents } from "./dataArrays.service";

// Guarda todos los eventos en AsyncStorage
export async function saveEvents(events: event[]): Promise<void> {
  const stringfyEvents = JSON.stringify(
    events.map((events) => ({
      ...events,
      startTime: events.startTime ? dateToStore(events.startTime) : undefined,
      finishedTime: events.finishedTime
        ? dateToStore(events.finishedTime)
        : undefined,
    }))
  );
  await AsyncStorage.setItem(STORAGE_KEYS.EVENTS_KEY, stringfyEvents);
}

// Devuelve un evento concreto por ID
export async function getEventById(id: number): Promise<event | undefined> {
  const normalizedEvents = getEvents();
  const selectedEvent: event | undefined = (await normalizedEvents).find(
    (e) => e.id === id
  );
  return selectedEvent;
}

// Genera un ID nuevo basado en los eventos existentes
export function generateId(events: event[]): number {
  const lenght = events.length;
  const id = events[lenght - 1].id + 1;
  return id;
}