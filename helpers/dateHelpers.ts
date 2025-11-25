export const dateToStore = (date: Date) => date.toISOString();

export const fromStoredDate = (
  stored: string | undefined | null
): Date | undefined => {
  if (!stored) return undefined;
  const parsed = new Date(stored);
  return isNaN(parsed.getTime()) ? undefined : parsed;
};

// Time function for set new dates
export function setTime(date: Date, h: number, m: number) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    h,
    m,
    0,
    0
  );
}

export function buildDateWithTime(date: Date, time: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes(),
    0,
    0
  );
}

export function buildTimeOnCurrentDate(time: Date) {
  return new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    time.getHours(),
    time.getMinutes(),
    0,
    0
  );
}
