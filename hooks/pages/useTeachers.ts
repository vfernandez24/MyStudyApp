import STORAGE_KEYS from "@/constants/storageKeys";
import { subject, teacher } from "@/constants/types";
import {
  getSubjects,
  getTeachers,
  setItem,
} from "@/services/storage/dataArrays.service";
import { useState } from "react";

const useTeachers = () => {
  const [teachers, setTeachers] = useState<teacher[]>([]);
  const [subjects, setSubjects] = useState<subject[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<teacher | null>(null);

  const loadEvents = async () => {
    const teachersAwait = await getTeachers();
    const subjectsAwait = await getSubjects();
    setTeachers(teachersAwait);
    setSubjects(subjectsAwait);
  };

  async function deleteGrade(id: number) {
    const newTeachers = teachers.filter((teacher) => teacher.id !== id);
    const parsed = JSON.stringify(newTeachers);
    await setItem(STORAGE_KEYS.TEACHERS_KEY, parsed);

    const newSubjects = subjects.map((sub) => {
      if (sub.teacher === id) {
        let newSub: subject = {
          ...sub,
          teacher: -1,
        };
        return newSub;
      } else {
        return sub;
      }
    });
    const parsedSubs = JSON.stringify(newSubjects);
    await setItem(STORAGE_KEYS.SUBJECTS_KEY, parsedSubs);

    setSelectedTeacher(null);
  }

  return {
    teachers,
    subjects,
    loadEvents,
    deleteGrade,
    selectedTeacher,
    setSelectedTeacher,
  };
};

export default useTeachers;
