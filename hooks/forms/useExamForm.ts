import { defaultExams } from "@/constants/calendarConstants";
import { defaultGrades, defaultSubjects } from "@/constants/defaultValues";
import STORAGE_KEYS from "@/constants/storageKeys";
import { exam, grade, notification, subject } from "@/constants/types";
import { getExams, getGrades, getIdEdit, getSubjects, getTypeForm, setItem } from "@/services/storage/dataArrays.service";
import { router } from "expo-router";
import { useEffect, useState } from "react";

const useExamForm = () => {
  const today = new Date()
  const [error, setError] = useState<{
    name: boolean;
    subject: boolean;
  }>({
    name: false,
    subject: false,
  });
  const [exams, setExams] = useState<exam[]>(defaultExams);
  const [subjects, setSubjects] = useState<subject[]>(defaultSubjects);
  const [grades, setGrades] = useState<grade[]>(defaultGrades);

  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [allDay, setAllDay] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<Date>(
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      12,
      0,
      0,
      0
    )
  );
  const [finishedTime, setFinishedTime] = useState<Date>(
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      13,
      0,
      0,
      0
    )
  );
  const [subject, setSubject] = useState<number>(-1);
  const [grade, setGrade] = useState<number | undefined>();
  const [notifications, setNotifications] = useState<notification[]>([]);
  const [description, setDescription] = useState<string | undefined>();

  const [typeForm, setTypeForm] = useState<string>("create");
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    try {
      const examsAwait = await getExams()
      const subjectsAwait = await getSubjects()
      const gradesAwait = await getGrades()
      const typeFormAwait = await getTypeForm()
      const idEditAwait = await getIdEdit(STORAGE_KEYS.ID_EXAM_KEY)
      setExams(examsAwait);
      setSubjects(subjectsAwait);
      setGrades(gradesAwait);
      setTypeForm(typeFormAwait);

      if (typeFormAwait === "edit" && idEditAwait) {
        setEditId(idEditAwait);

        const current = examsAwait.find((exam) => exam.id === idEditAwait);
        if (current) {
          setName(current.name);
          setDate(current.date);
          setAllDay(current.allDay);
          setStartTime((prev) => current.startTime ?? prev);
          setFinishedTime((prev) => current.finishedTime ?? prev);
          setSubject(current.subject);
          setGrade(current.grade);
          setDescription(current.description);
        }
      }
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    if (allDay) {
      setNotifications((n) => n.filter((n) => n.time >= 24 * 60 * 60 * 1000));
    }
  }, [allDay]);

  function checkData() {
    const isNameValid = name !== "";
    const isSubjectValid = subject !== -1;

    setError({
      name: !isNameValid,
      subject: !isSubjectValid,
    });

    return isNameValid && isSubjectValid;
  }

  async function submit() {
    let newExams: exam[] = exams;
    const isValid = checkData();
    let id: number = exams.length > 0 ? exams[exams.length - 1].id + 1 : 0;
    if (typeForm !== "create") {
      id = editId ?? 0;
    }
    if (isValid) {
      const newExam: exam = {
        allDay: allDay,
        date: date,
        notifications: notifications,
        grade: grade,
        name: name,
        subject: subject,
        description: description,
        finishedTime: !allDay ? finishedTime : undefined,
        startTime: !allDay ? startTime : undefined,
        id: id,
      };
      if (typeForm == "create") {
        newExams = [...exams, newExam];
      } else {
        newExams = exams.map((exam) => (exam.id === editId ? newExam : exam));
      }

      let today = new Date(startTime || date);
      // const oldNotifications = await getNotifications(
      //   STORAGE_KEYS.ENOTIFICATIONS_KEY
      // );
      // 
      // const userStudyTime = await getUserStudyTime();
      // const newNotifications: { date: Date; id: number }[] = notifications.map(
      //   (n) => {
      //     let newNot;
      //     if (allDay) {
      //       const newDate = new Date(date.getTime() - n.time);
      //       newNot = {
      //         date: new Date(
      //           newDate.getFullYear(),
      //           newDate.getMonth(),
      //           newDate.getDate(),
      //           userStudyTime[0],
      //           userStudyTime[1],
      //           userStudyTime[2]
      //         ),
      //         id: id,
      //       };
      //     } else {
      //       let newDate = new Date(today.getTime() - n.time);
      //       if (newDate.getHours() < 6) {
      //         newDate.setHours(6, 0, 0, 0);
      //       }
      //       if (newDate.getHours() >= 22) {
      //         newDate.setHours(22, 0, 0, 0);
      //       }
      //       newNot = {
      //         date: newDate,
      //         id: id,
      //       };
      //     }
      //     return newNot;
      //   }
      // );
      // let allNotifications = [...normalizedNotifications, ...newNotifications];
      // let seen = new Set<string>();
      // let filteredNotifications: { date: Date; id: number }[] = [];
      // for (let notif of allNotifications) {
      //   if (!notif?.date) continue;
      //   let key = notif.id + "_" + notif.date.getTime();
      //   if (!seen.has(key)) {
      //     seen.add(key);
      //     filteredNotifications.push(notif);
      //   }
      // }
      // await setItem(
      //   STORAGE_KEYS.ENOTIFICATIONS_KEY,
      //   JSON.stringify(
      //     filteredNotifications.map((n) => ({
      //       id: n.id,
      //       date: n.date,
      //     }))
      //   )
      // );

      const stringfyExams = JSON.stringify(
        newExams.map((exam) => ({
          ...exam,
          date: exam.date ? exam.date : undefined,
          startTime: exam.startTime ? exam.startTime : undefined,
          finishedTime: exam.finishedTime ? exam.finishedTime : undefined,
        }))
      );
      await setItem(STORAGE_KEYS.EXAMS_KEY, stringfyExams);

      router.back();
    }
  }

  return { error, submit, exams, subjects, grades, loadData, typeForm, editId, name, date, allDay, startTime, finishedTime, subject, grade, notifications, description, setName, setDate, setAllDay, setStartTime, setFinishedTime, setSubject, setGrade, setNotifications, setDescription }
}

export default useExamForm
