import { task } from "@/constants/types";

export function splitAndSortTasks(tasks: task[]) {
  const now = new Date();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;

  // Función auxiliar para saber si una fecha es urgente
  function isUrgent(date?: Date): boolean {
    if (!date) return false;
    const timeDiff = date.getTime() - now.getTime();

    // Si la fecha es en más de 7 días, NO es urgente
    return timeDiff <= sevenDays;
  }

  // Función auxiliar para ordenar
  function sortByDate(a: task, b: task) {
    if (!a.finishedDate && !b.finishedDate) return 0;
    if (!a.finishedDate) return 1;
    if (!b.finishedDate) return -1;
    return a.finishedDate.getTime() - b.finishedDate.getTime();
  }

  // Pending
  const pending = tasks.filter((t) => t.status === "pending");
  const pendingUrgent = pending
    .filter((t) => isUrgent(t.finishedDate))
    .sort(sortByDate);
  const pendingNormal = pending
    .filter((t) => !isUrgent(t.finishedDate))
    .sort(sortByDate);

  // In progress
  const inProgress = tasks.filter((t) => t.status === "inProgress");
  const inProgressUrgent = inProgress
    .filter((t) => isUrgent(t.finishedDate))
    .sort(sortByDate);
  const inProgressNormal = inProgress
    .filter((t) => !isUrgent(t.finishedDate))
    .sort(sortByDate);

  return {
    pendingUrgent,
    pendingNormal,
    inProgressUrgent,
    inProgressNormal,
  };
}
