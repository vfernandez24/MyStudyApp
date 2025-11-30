import { defaultSubjects, defaultTasks } from "@/constants/defaultValues";
import STORAGE_KEYS from "@/constants/storageKeys";
import { subject, task } from "@/constants/types";
import { splitAndSortTasks } from "@/helpers/splitTasks";
import { setItem } from "@/services/storage/dataArrays.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMemo, useState } from "react";

const useTasks = () => {
  const [tasks, setTasks] = useState<task[]>([]);
  const [subjects, setSubjects] = useState<subject[]>([]);
  const [selectedTask, setSelectedTask] = useState<task | null>(null);

  async function getData(): Promise<task[]> {
    const awaitTasks = await AsyncStorage.getItem(STORAGE_KEYS.TASKS_KEY);
    const parsedTasks: task[] = awaitTasks
      ? JSON.parse(awaitTasks, (key, value) => {
          if (key === "finishedDate") {
            return value ? new Date(value) : undefined;
          }
          return value;
        })
      : defaultTasks;
    setTasks(parsedTasks);

    const subjectsAwait = await AsyncStorage.getItem(STORAGE_KEYS.SUBJECTS_KEY);
    const parsedSubjects: subject[] = subjectsAwait
      ? JSON.parse(subjectsAwait)
      : defaultSubjects;
    setSubjects(parsedSubjects);

    return parsedTasks;
  }

  const { pendingUrgent, pendingNormal, inProgressUrgent, inProgressNormal } =
    useMemo(() => splitAndSortTasks(tasks), [tasks]);

  async function deleteTask(id: number) {
    const newTasks = tasks.filter((e) => e.id !== id);
    setTasks(newTasks);
    const parsed = JSON.stringify(newTasks);
    await setItem(STORAGE_KEYS.TASKS_KEY, parsed);
    setSelectedTask(null);
  }
  return {
    tasks,
    subjects,
    getData,
    selectedTask,
    setSelectedTask,
    pendingUrgent,
    pendingNormal,
    inProgressUrgent,
    inProgressNormal,
    deleteTask,
  };
};

export default useTasks;
