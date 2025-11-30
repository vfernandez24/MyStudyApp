import STORAGE_KEYS from "@/constants/storageKeys";
import { grade, period, subject } from "@/constants/types";
import selectColor from "@/helpers/selectColor";
import {
  getGrades,
  getPeriods,
  getSubjects,
  setItem,
} from "@/services/storage/dataArrays.service";
import { useEffect, useState } from "react";

const useGrades = () => {
  const [subjects, setSubjects] = useState<subject[]>([]);
  const [periods, setPeriods] = useState<period[]>([]);
  const [grades, setGrades] = useState<grade[]>([]);
  const [promedio, setPromedio] = useState<number>(0);
  const [promedioColor, setPromedioColor] = useState(0);

  const [selectedGrade, setSelectedGrade] = useState<grade | null>(null);

  const loadData = async () => {
    const subjectsAwait = await getSubjects();
    const periodsAwait = await getPeriods();
    const gradesAwait = await getGrades();
    setSubjects(subjectsAwait);
    setPeriods(periodsAwait);
    setGrades(gradesAwait);
  };

  useEffect(() => {
    if (grades.length === 0) return;

    const avg = grades.reduce((sum, g) => sum + g.grade, 0) / grades.length;
    setPromedio(Number(avg.toFixed(2)));
    setPromedioColor(selectColor(avg));
  }, [grades]);

  let gradesPerSubject: { [key: string]: number } = {};
  subjects.forEach((sub) => {
    gradesPerSubject[sub.id] = 0;
  });

  grades.forEach((grade) => {
    if (gradesPerSubject[grade.subject] !== undefined) {
      gradesPerSubject[grade.subject] += 1;
    }
  });

  async function deleteGrade(id: number) {
    const newGrades = grades.filter((grade) => grade.id !== id);
    setGrades(newGrades);
    const parsed = JSON.stringify(newGrades);
    await setItem(STORAGE_KEYS.GRADES_KEY, parsed);
    setSelectedGrade(null);
  }
  return {
    subjects,
    periods,
    grades,
    promedio,
    promedioColor,
    setSubjects,
    setPeriods,
    setGrades,
    setPromedio,
    setPromedioColor,
    loadData,
    gradesPerSubject,
    selectedGrade,
    setSelectedGrade,
    deleteGrade,
  };
};

export default useGrades;
