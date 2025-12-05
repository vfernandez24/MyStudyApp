import { defaultEvents, defaultExams } from "@/constants/calendarConstants";
import {
  defaultGrades,
  defaultPeriods,
  defaultSubjects,
  defaultTeachers,
} from "@/constants/defaultValues";
import STORAGE_KEYS from "@/constants/storageKeys";
import {
  event,
  exam,
  grade,
  period,
  subject,
  teacher
} from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function deleteItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export async function getSubjects(): Promise<subject[]> {
  const subjectsAwait = await AsyncStorage.getItem(STORAGE_KEYS.SUBJECTS_KEY);
  const parsedSubjects: subject[] = subjectsAwait
    ? JSON.parse(subjectsAwait)
    : defaultSubjects;
  return parsedSubjects;
}

export async function getExams(): Promise<exam[]> {
  const examsAwait = await AsyncStorage.getItem(STORAGE_KEYS.EXAMS_KEY);
  const parsedExams: exam[] = examsAwait
    ? JSON.parse(examsAwait, (key, value) => {
      if (key === "date" || key === "startTime" || key === "finishedTime") {
        return value ? new Date(value) : undefined;
      }
      return value;
    })
    : defaultExams;
  return parsedExams;
}

export async function getGrades(): Promise<grade[]> {
  const gradesAwait = await AsyncStorage.getItem(STORAGE_KEYS.GRADES_KEY);
  const parsedGrades: grade[] = gradesAwait
    ? JSON.parse(gradesAwait)
    : defaultGrades;
  return parsedGrades;
}

export async function getTeachers(): Promise<teacher[]> {
  const teachersAwait = await AsyncStorage.getItem(STORAGE_KEYS.TEACHERS_KEY);
  const parsedTeachers: teacher[] = teachersAwait
    ? JSON.parse(teachersAwait)
    : defaultTeachers;
  return parsedTeachers;
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

export async function getPeriods(): Promise<period[]> {
  const periodsAwait = await AsyncStorage.getItem(STORAGE_KEYS.PERIODS_KEY);
  const parsedPeriods: period[] = periodsAwait
    ? JSON.parse(periodsAwait)
    : defaultPeriods;
  return parsedPeriods;
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

export async function setItem(key: string, value: string): Promise<void> {
  await AsyncStorage.setItem(key, value);
}

export async function getUserStudyTime(): Promise<number[]> {
  const userStudyTimeAwait = await AsyncStorage.getItem(
    STORAGE_KEYS.USER_STUDYTIME_KEY
  );
  const parsedUserStudyTime = userStudyTimeAwait
    ? JSON.parse(userStudyTimeAwait)
    : [17, 0, 0];
  return parsedUserStudyTime;
}

// export async function getNotifications(key: string): Promise<{ date: Date; id: number }[]> {
//   const notificationsAwait = await AsyncStorage.getItem(key);
//   const parsedNotifications: notification[] = notificationsAwait
//     ? JSON.parse(notificationsAwait)
//     : [];
//     const normalizedNotifications: { date: Date; id: number }[] =
//         parsedNotifications.map((n) => ({
//           id: n.time,
//           date: new Date(n.),
//         }));
//   return normalizedNotifications;
// }