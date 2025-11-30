import STORAGE_KEYS from "@/constants/storageKeys";
import { exam, grade, subject } from "@/constants/types";
import {
  getExams,
  getGrades,
  getSubjects,
  setItem,
} from "@/services/storage/dataArrays.service";
import { useEffect, useState } from "react";

const useExams = () => {
  const [subjects, setSubjects] = useState<subject[]>([]);
  const [grades, setGrades] = useState<grade[]>([]);
  const [exams, setExams] = useState<exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<exam | null>(null);

  const loadEvents = async () => {
    const examsAwait = await getExams();
    setExams(examsAwait);

    const subjectsAwait = await getSubjects();
    setSubjects(subjectsAwait);

    const gradesAwait = await getGrades();
    setGrades(gradesAwait);
  };

  async function deleteExam(id: number) {
    const newExams = exams.filter((e) => e.id !== id);
    setExams(newExams);
    const stringfyExams = JSON.stringify(newExams);
    await setItem(STORAGE_KEYS.EXAMS_KEY, stringfyExams);
    setSelectedExam(null);
  }

  const now = new Date();
  function splitExamsByDate(exams: exam[]): { past: exam[]; future: exam[] } {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Muy importante: normalizar la fecha actual

    const past: exam[] = [];
    const future: exam[] = [];

    for (const ex of exams) {
      let examDate = new Date(ex.date);
      examDate.setHours(0, 0, 0, 0); // Normalizamos también

      if (examDate < today) {
        past.push(ex);
      } else {
        future.push(ex);
      }
    }

    return { past, future };
  }

  function groupExamsByMonth(
    exams: exam[]
  ): { month: string; exams: exam[] }[] {
    const now = new Date();
    const grouped = new Map<string, exam[]>();

    for (const ex of exams) {
      if (!ex.date) continue;

      const date = new Date(ex.date);
      if (isNaN(date.getTime())) continue;

      const month = date.getMonth(); // 0–11
      const year = date.getFullYear();
      const key = `${month}-${year}`;

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(ex);
    }

    const result = Array.from(grouped.entries())
      .map(([key, exams]) => ({
        month: key,
        exams: exams.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        }),
      }))
      .sort((a, b) => {
        const [mA, yA] = a.month.split("-").map(Number);
        const [mB, yB] = b.month.split("-").map(Number);
        return new Date(yA, mA).getTime() - new Date(yB, mB).getTime();
      });

    return result;
  }

  const [pastExams, setPastExams] = useState<exam[]>([]);
  const [futureExams, setFutureExams] = useState<exam[]>([]);

  useEffect(() => {
    const { past, future } = splitExamsByDate(exams);
    setPastExams(past);
    setFutureExams(future);
  }, [exams]);

  interface groupMonth {
    month: string;
    exams: exam[];
  }

  const [pastExamsGroups, setPastExamsGroups] = useState<groupMonth[]>([]);
  const [futureExamsGroups, setFutureExamsGroups] = useState<groupMonth[]>([]);

  useEffect(() => {
    const examsByMonthPast = groupExamsByMonth(pastExams);
    const examsByMonthFuture = groupExamsByMonth(futureExams);

    setPastExamsGroups(examsByMonthPast);
    setFutureExamsGroups(examsByMonthFuture);
  }, [pastExams, futureExams]);

  return {
    subjects,
    grades,
    exams,
    setSubjects,
    setGrades,
    setExams,
    loadEvents,
    deleteExam,
    selectedExam,
    setSelectedExam,
    pastExams,
    futureExams,
    pastExamsGroups,
    futureExamsGroups,
    now,
  };
};

export default useExams;
