import { defaultEvents } from "@/constants/calendarConstants";
import { defaultSubjects } from "@/constants/defaultValues";
import STORAGE_KEYS from "@/constants/storageKeys";
import { event, subject } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getSubjects(): Promise<subject[]> {
  const subjectsAwait = await AsyncStorage.getItem(STORAGE_KEYS.SUBJECTS_KEY);
  const parsedSubjects: subject[] = subjectsAwait
    ? JSON.parse(subjectsAwait)
    : defaultSubjects;
  return parsedSubjects;
}

export async function getEvents(): Promise<event[]> {
  const eventsAwait = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS_KEY);
  const parsedEvents: event[] = eventsAwait
    ? JSON.parse(eventsAwait)
    : defaultEvents;
  const normalizedEvents: event[] = parsedEvents.map((e) => ({
    ...e,
    startTime: new Date(e.startTime),
    finishedTime: new Date(e.finishedTime),
  }));
  return normalizedEvents;
}

export async function getTypeForm(): Promise<"create" | "edit"> {
  const typeAwait = await AsyncStorage.getItem(STORAGE_KEYS.TYPEFORM_KEY);
  const parsedTypeForm =
    typeAwait && typeAwait === "create" ? "create" : "edit";
  return parsedTypeForm;
}

export async function getIdEdit(key: string): Promise<number> {
  const idAwait = await AsyncStorage.getItem(key);
  const normalizedId = Number(idAwait);
  return normalizedId;
}
