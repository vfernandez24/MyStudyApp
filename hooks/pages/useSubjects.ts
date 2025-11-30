import { gradeColors } from "@/constants/colors";
import { defaultExams, defaultSubjects } from "@/constants/defaultValues";
import STORAGE_KEYS from "@/constants/storageKeys";
import { exam, grade, subject, teacher } from "@/constants/types";
import selectColor from "@/helpers/selectColor";
import {
  getGrades,
  getIdEdit,
  getSubjects,
  getTeachers,
  setItem,
} from "@/services/storage/dataArrays.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";

const useSubjects = () => {
  const [subjects, setSubjects] = useState<subject[]>([]);
  const [grades, setGrades] = useState<grade[]>([]);
  const [subjectGrades, setSubjectGrades] = useState<grade[]>([]);
  const [exams, setExams] = useState<exam[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<subject>();
  const [teachers, setTeachers] = useState<teacher[]>([]);
  const loadEvents = async () => {
    const subjectsAwait = await getSubjects();
    const gradesAwait = await getGrades();
    const examsAwait = await AsyncStorage.getItem(STORAGE_KEYS.EXAMS_KEY);
    const selectedAwait = await getIdEdit(STORAGE_KEYS.ID_SUBJECT_KEY);
    const teachersAwait = await getTeachers();

    const parsedExams: exam[] = examsAwait
      ? JSON.parse(examsAwait)
      : defaultExams;
    const parsedSelectedSubject = selectedAwait
      ? subjectsAwait.find((s) => s.id == selectedAwait)
      : defaultSubjects[0];
    const newSubjectGrades = selectedAwait
      ? gradesAwait.filter((g) => g.subject == selectedAwait)
      : [];
    setSubjects(subjectsAwait);
    setGrades(gradesAwait);
    setExams(parsedExams);
    setSelectedSubject(parsedSelectedSubject);
    setSubjectGrades(newSubjectGrades);
    setTeachers(teachersAwait);
  };

  const [subjectGradesGroups, setSubjectGradesGroups] = useState<grade[][]>([]);
  const [promedio, setPromedio] = useState<number | null>(null);
  const [promedioGroup, setPromedioGroup] = useState<number[]>([]);
  const [promedioGroupBg, setPromedioGroupBg] = useState<number[]>([]);
  const [promedioBg, setPromedioBg] = useState<number>(0);

  const safeColorKey = (val: any) => (val in gradeColors ? val : "default");

  useEffect(() => {
    if (subjectGrades.length === 0) return;

    const avg =
      subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length;

    const gradesWriten = subjectGrades
      ? subjectGrades.filter((g) => g.type == "write")
      : [];
    const promedioEscrito =
      gradesWriten.length > 0 && gradesWriten !== undefined
        ? gradesWriten.reduce((sum, g) => sum + g.grade, 0) /
          gradesWriten.length
        : 0;

    const gradesOral = subjectGrades
      ? subjectGrades.filter((g) => g.type == "oral")
      : [];
    const promedioOral =
      gradesOral.length > 0 && gradesOral !== undefined
        ? gradesOral.reduce((sum, g) => sum + g.grade, 0) / gradesOral.length
        : 0;

    const gradesPractical = subjectGrades
      ? subjectGrades.filter((g) => g.type == "practical")
      : [];
    const promedioPractical =
      gradesPractical.length > 0 && gradesPractical !== undefined
        ? gradesPractical.reduce((sum, g) => sum + g.grade, 0) /
          gradesPractical.length
        : 0;

    const newSubjectGradesGroups = [gradesWriten, gradesOral, gradesPractical];
    const newPromedios = [promedioEscrito, promedioOral, promedioPractical];
    const newPromediosBg = [
      safeColorKey(selectColor(Number(promedioEscrito.toFixed(2)))),
      safeColorKey(selectColor(Number(promedioOral.toFixed(2)))),
      safeColorKey(selectColor(Number(promedioPractical.toFixed(2)))),
    ];

    setSubjectGradesGroups(newSubjectGradesGroups);
    setPromedio(Number(avg.toFixed(2)));
    setPromedioBg(selectColor(Number(avg.toFixed(2))));
    setPromedioGroup(newPromedios);
    setPromedioGroupBg(newPromediosBg);
  }, [subjectGrades]);

  function deleteSubjectGrades() {
    const toRemoveIds = new Set(subjectGrades.map((obj) => obj.id));

    const filtered = grades.filter((obj) => !toRemoveIds.has(obj.id));

    return filtered;
  }

  async function deleteSubject(id: number) {
    const newGrades = deleteSubjectGrades();

    const newSubjects = subjects.filter((sub) => sub.id !== id);
    setGrades(newGrades);
    await setItem(STORAGE_KEYS.GRADES_KEY, JSON.stringify(newGrades));
    const avg = grades.reduce((sum, g) => sum + g.grade, 0) / grades.length;
    const rounded = Number(avg.toFixed(2));
    await setItem(STORAGE_KEYS.PROMEDIO_JEY, String(rounded));
    setSubjects(newSubjects);
    const stringify = JSON.stringify(newSubjects);
    await setItem(STORAGE_KEYS.SUBJECTS_KEY, stringify);
    router.back();
  }

  return {
    subjects,
    setSubjects,
    loadEvents,
    grades,
    setGrades,
    subjectGrades,
    setSubjectGrades,
    exams,
    setExams,
    selectedSubject,
    setSelectedSubject,
    teachers,
    setTeachers,
    subjectGradesGroups,
    promedio,
    promedioGroup,
    promedioGroupBg,
    promedioBg,
    deleteSubject,
  };
};

export default useSubjects;
