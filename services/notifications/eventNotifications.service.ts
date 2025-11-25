import notificationsDef from "@/constants/notifications";
import STORAGE_KEYS from "@/constants/storageKeys";
import { event } from "@/constants/types";
import { dateToStore, fromStoredDate } from "@/helpers/dateHelpers";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveNotifications(
  events: event[],
  startTime: Date,
  allDay: boolean,
  id: number
): Promise<void> {
  let sTime = new Date(startTime);
  const oldNotifications = await AsyncStorage.getItem(
    STORAGE_KEYS.EVNOTIFICATIONS_KEY
  );
  const parsedOldNotifications: { date: string; id: number }[] =
    oldNotifications ? JSON.parse(oldNotifications) : [];
  const normalizedNotifications: { date: Date; id: number }[] =
    parsedOldNotifications.map((n) => ({
      ...n,
      date: fromStoredDate(n.date) ?? new Date(),
    }));
  const awaitUserStudyTime = await AsyncStorage.getItem(
    STORAGE_KEYS.USER_STUDYTIME_KEY
  );
  const userStudyTime = awaitUserStudyTime
    ? JSON.parse(awaitUserStudyTime)
    : [17, 0, 0];
  const newNotifications: { date: Date; id: number }[] = notificationsDef.map(
    (n) => {
      let newNot;
      if (allDay) {
        const newDate = new Date(startTime.getTime() - n.time);
        newNot = {
          date: new Date(
            newDate.getFullYear(),
            newDate.getMonth(),
            newDate.getDate(),
            userStudyTime[0],
            userStudyTime[1],
            userStudyTime[2]
          ),
          id: id,
        };
      } else {
        let newDate = new Date(sTime.getTime() - n.time);
        if (newDate.getHours() < 6) {
          newDate.setHours(6, 0, 0, 0);
        }
        if (newDate.getHours() >= 22) {
          newDate.setHours(22, 0, 0, 0);
        }
        newNot = {
          date: newDate,
          id: id,
        };
      }
      return newNot;
    }
  );
  let allNotifications = [...normalizedNotifications, ...newNotifications];
  let seen = new Set<string>();
  let filteredNotifications: { date: Date; id: number }[] = [];
  for (let notif of allNotifications) {
    if (!notif?.date) continue;
    let key = notif.id + "_" + notif.date.getTime();
    if (!seen.has(key)) {
      seen.add(key);
      filteredNotifications.push(notif);
    }
  }
  await AsyncStorage.setItem(
    STORAGE_KEYS.EVNOTIFICATIONS_KEY,
    JSON.stringify(
      filteredNotifications.map((n) => ({
        id: n.id,
        date: dateToStore(n.date),
      }))
    )
  );
}
