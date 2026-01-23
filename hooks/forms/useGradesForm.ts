import {
  defaultGrades,
  defaultPeriods,
  defaultSubjects,
} from "@/constants/defaultValues";
import STORAGE_KEYS from "@/constants/storageKeys";
import { grade, period, subject } from "@/constants/types";
import {
  getGrades,
  getIdEdit,
  getPeriods,
  getSubjects,
  getTypeForm,
  setItem,
} from "@/services/storage/dataArrays.service";
import { router } from "expo-router";
import { useState } from "react";

const useGradesForm = () => {
  const [subjects, setSubjects] = useState<subject[]>(defaultSubjects);
  const [periods, setPeriods] = useState<period[]>(defaultPeriods);
  const [grades, setGrades] = useState<grade[]>(defaultGrades);

  const [error, setError] = useState<{
    grade: boolean;
    subject: boolean;
  }>({
    grade: false,
    subject: false,
  });

  const fetchData = async () => {
    try {
      const subjectsAwait = await getSubjects();
      const periodsAwait = await getPeriods();
      const gradesAwait = await getGrades();
      const typeFormAwait = await getTypeForm();
      const idEditAwait = await getIdEdit(STORAGE_KEYS.ID_GRADE_KEY);

      setSubjects(subjectsAwait);
      setPeriods(periodsAwait);
      setGrades(gradesAwait);

      function currentPeriod() {
        const now = new Date();
        let currentPeriod: period | null = null;

        for (const p of periods) {
          if (p.startTime && p.finishTime) {
            if (now >= p.startTime && now <= p.finishTime) {
              currentPeriod = p;
              break;
            }
          }
        }
        return currentPeriod?.id;
      }

      setPeriod(currentPeriod() ?? period);

      const formType = typeFormAwait ?? "create";
      setTypeForm(formType);

      if (formType === "edit" && idEditAwait) {
        const id = Number(idEditAwait);
        setEditId(id);

        const current = gradesAwait.find((g) => g.id === id);
        if (current) {
          setGrade(current.grade);
          setSubject(current.subject);
          setDate(current.date);
          setPeriod(current.period);
          setWeight(current.weight ?? null);
          setType(current.type);
          setDescription(current.description ?? "");
        }
      }
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
    }
  };

  const today = new Date();
  const [grade, setGrade] = useState(0);
  const [subject, setSubject] = useState(-1);
  const [date, setDate] = useState<string>(today.toISOString().split("T")[0]);
  const [period, setPeriod] = useState(0);
  const [weight, setWeight] = useState<number | null>(null);
  const [type, setType] = useState<number>(0);
  const [description, setDescription] = useState<string | undefined>("");

  const [typeForm, setTypeForm] = useState<string>("create");
  const [editId, setEditId] = useState<number | null>(null);

  function checkData() {
    const isGradeValid = grade >= 0 && grade <= 10;
    const isSubjectValid = subject !== -1;

    setError({
      grade: !isGradeValid,
      subject: !isSubjectValid,
    });

    return isGradeValid && isSubjectValid;
  }

  async function submit() {
    let newGrades: grade[] = grades;

    const isValid = checkData();
    const id = grades.length > 0 ? grades[grades.length - 1].id + 1 : 0;

    if (isValid) {
      const newGrade: grade = {
        date: date,
        grade: grade,
        id: id,
        period: period,
        subject: subject,
        type: type,
        description: description,
        weight: weight,
      };
      if (typeForm == "create") {
        newGrades = [...grades, newGrade];
      } else {
        newGrades = grades.map((g) => (g.id === editId ? newGrade : g));
      }

      const stringfyGrades = JSON.stringify(newGrades);
      await setItem(STORAGE_KEYS.GRADES_KEY, stringfyGrades);

      router.back();
    }
  }

  return {
    subjects,
    periods,
    grades,
    error,
    fetchData,
    grade,
    setGrade,
    subject,
    setSubject,
    date,
    setDate,
    period,
    setPeriod,
    weight,
    setWeight,
    type,
    setType,
    description,
    setDescription,
    typeForm,
    setTypeForm,
    editId,
    setEditId,
    setError,
    submit,
  };
};

export default useGradesForm;
