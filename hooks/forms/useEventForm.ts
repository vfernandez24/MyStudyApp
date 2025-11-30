import STORAGE_KEYS from "@/constants/storageKeys";
import { event, notification, subject } from "@/constants/types";
import { buildDateWithTime } from "@/helpers/dateHelpers";
import {
  getEvents,
  getIdEdit,
  getSubjects,
  getTypeForm,
  setItem,
} from "@/services/storage/dataArrays.service";
import { generateId, saveEvents } from "@/services/storage/events.service";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export const useEventFormData = (
  show: boolean = false,
  showT: boolean = false
) => {
  const today = new Date();

  // Data states
  const [events, setEvents] = useState<event[]>([]);
  const [subjects, setSubjects] = useState<subject[]>([]);
  const [typeForm, setTypeForm] = useState<"create" | "edit">("create");
  const [editId, setEditId] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      const loadedEvents = await getEvents();
      const loadedSubjects = await getSubjects();
      const loadedTypeForm = await getTypeForm();
      const loadedEditId = await getIdEdit(STORAGE_KEYS.ID_EVENT_KEY);

      setEvents(loadedEvents);
      setSubjects(loadedSubjects);
      setTypeForm(loadedTypeForm);
      setEditId(loadedEditId);
    };
    loadData();
  }, []);

  // Form states
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
  const [subject, setSubject] = useState<number | undefined>(-1);
  const [types, setTypes] = useState<"personal" | "job" | "school" | "other">(
    "school"
  );
  const [color, setColor] = useState<number | undefined>(undefined);
  const [icon, setIcon] = useState<number | undefined>(undefined);
  const [notifications, setNotifications] = useState<notification[]>([]);
  const [description, setDescription] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  // Cargar evento existente
  // useEffect(() => {}, [existingEvent]);

  // Validaciones del formulario
  function validation() {
    const correctTimes = startTime.getTime() < finishedTime.getTime();
    const correctName = name !== "" && name !== " ";
    return correctTimes && correctName;
  }

  // Funciones de setters avanzados
  function changeStartDate(date: Date) {
    const newDate = buildDateWithTime(date, startTime);
    setStartTime(newDate);
    checkStartTime(newDate);
  }

  function changeEndDate(date: Date) {
    const newDate = buildDateWithTime(date, finishedTime);
    setFinishedTime(newDate);
    checkFinishedTime(newDate);
  }

  function changeStartTime(time: Date) {
    const newDate = buildDateWithTime(startTime, time);
    setStartTime(newDate);
    checkStartTime(newDate);
  }

  function changeFinishedTime(time: Date) {
    const newDate = buildDateWithTime(finishedTime, time);
    setFinishedTime(newDate);
    checkFinishedTime(newDate);
  }

  // Functions to update the states if some values changes
  useEffect(() => {
    const sel = subjects.find((s) => s.id == subject);
    setColor((prev) => (sel ? sel.color : prev));
  }, [subject, subjects]);

  useEffect(() => {
    if (allDay) {
      setStartTime(
        (prev) =>
          new Date(
            prev.getFullYear(),
            prev.getMonth(),
            prev.getDate(),
            0,
            0,
            0,
            0
          )
      );
      setFinishedTime(
        (prev) =>
          new Date(
            prev.getFullYear(),
            prev.getMonth(),
            prev.getDate(),
            23,
            59,
            0,
            0
          )
      );
    } else {
      setStartTime(
        (prev) =>
          new Date(
            prev.getFullYear(),
            prev.getMonth(),
            prev.getDate(),
            12,
            0,
            0,
            0
          )
      );
      setFinishedTime(
        (prev) =>
          new Date(
            prev.getFullYear(),
            prev.getMonth(),
            prev.getDate(),
            13,
            0,
            0,
            0
          )
      );
    }
  }, [allDay]);

  function checkStartTime(startTime: Date) {
    if (startTime.getTime() < finishedTime.getTime()) return;

    if (show === true) {
      if (allDay) {
        const newDate = new Date(
          startTime.getFullYear(),
          startTime.getMonth(),
          startTime.getDate(),
          23,
          59,
          0,
          0
        );
        setFinishedTime(newDate);
      } else {
        setFinishedTime(() => {
          const nextHour =
            startTime.getHours() >= finishedTime.getHours()
              ? startTime.getHours() === 23
                ? 23
                : startTime.getHours() + 1
              : finishedTime.getHours();

          const nextMinute =
            startTime.getHours() >= finishedTime.getHours() &&
            startTime.getHours() === 23
              ? 59
              : finishedTime.getMinutes();

          return new Date(
            startTime.getFullYear(),
            startTime.getMonth(),
            startTime.getDate(),
            nextHour,
            nextMinute,
            0,
            0
          );
        });
      }
    } else if (showT === true) {
      if (startTime.getHours() === 23) {
        setFinishedTime(
          new Date(
            startTime.getFullYear(),
            startTime.getMonth(),
            startTime.getDate(),
            23,
            59,
            0,
            0
          )
        );
      } else {
        setFinishedTime(
          new Date(
            startTime.getFullYear(),
            startTime.getMonth(),
            startTime.getDate(),
            startTime.getHours() + 1,
            startTime.getMinutes(),
            0,
            0
          )
        );
      }
    }
  }

  function checkFinishedTime(finishedTime: Date) {
    if (startTime.getTime() <= finishedTime.getTime()) return;

    if (showT) {
      if (allDay) {
        setStartTime(
          new Date(
            finishedTime.getFullYear(),
            finishedTime.getMonth(),
            finishedTime.getDate(),
            0,
            0,
            0,
            0
          )
        );
      } else {
        if (finishedTime.getHours() === 0) {
          setStartTime(
            (prev) =>
              new Date(
                prev.getFullYear(),
                prev.getMonth(),
                prev.getDate(),
                0,
                0,
                0,
                0
              )
          );
        } else {
          setStartTime(
            (prev) =>
              new Date(
                prev.getFullYear(),
                prev.getMonth(),
                prev.getDate(),
                finishedTime.getHours() - 1,
                prev.getMinutes(),
                0,
                0
              )
          );
        }
      }
    }
  }

  useEffect(() => {
    if (allDay) {
      setNotifications((n) => n.filter((n) => n.time >= 24 * 60 * 60 * 1000));
    }
  }, [allDay]);

  // Funcion de submit
  async function submit() {
    let isValid = validation();
    if (!isValid) return;
    let newEvents: event[] = events;
    let id: number = events.length > 0 ? generateId(events) : 0;
    if (typeForm !== "create") {
      id = editId ?? 0;
    }
    if (name !== "") {
      const newEvent: event = {
        allDay: allDay,
        color: color ?? 0,
        finishedTime: finishedTime,
        name: name,
        notifications: notifications,
        startTime: startTime,
        type: types,
        description: description,
        subject: subject === -1 ? undefined : subject,
        id: id,
      };
      if (typeForm == "create") {
        newEvents = [...events, newEvent];
      } else {
        newEvents = events.map((event) =>
          event.id === editId ? newEvent : event
        );
      }
      await saveEvents(newEvents);
      router.back();
      // return newEvents;

      //TODO await saveNotifications(events, startTime, allDay, id);
    }
  }

  async function deleteEv(id: number) {
    if (typeForm === "edit") {
      const newEvents = events.filter((ev) => ev.id !== id);
      const stringfyEvents = JSON.stringify(newEvents);
      await setItem(STORAGE_KEYS.EVENTS_KEY, stringfyEvents);
    }
    router.back();
  }

  return {
    name,
    setName,
    date,
    setDate,
    subjects,
    allDay,
    setAllDay,
    startTime,
    setStartTime,
    finishedTime,
    setFinishedTime,
    subject,
    setSubject,
    types,
    setTypes,
    icon,
    setIcon,
    color,
    setColor,
    notifications,
    setNotifications,
    description,
    setDescription,
    loading,
    setLoading,
    submit,
    deleteEv,
    editId,
    typeForm,
    changeEndDate,
    changeFinishedTime,
    changeStartDate,
    changeStartTime,
  };
};

export const useEventFormUI = () => {
  const [overlay, setOverlay] = useState<boolean>(false);
  const [overlaySelect, setOverlaySelect] = useState<boolean>(false);
  const [typeDate, setTypeDate] = useState<"start" | "finished">("start");
  const [overlayColor, setOverlayColor] = useState<boolean>(false);
  const [overlayType, setOverlayType] = useState<
    "subjects" | "notifications" | "typeEvents"
  >("subjects");
  const [alert, setAlert] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [showT, setShowT] = useState(false);
  const [error, setError] = useState<boolean>(false);

  function buttonDelete() {
    setAlert(true);
    setOverlay(true);
  }

  const {
    changeEndDate,
    changeFinishedTime,
    changeStartDate,
    changeStartTime,
  } = useEventFormData();
  const onChange = (_event: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate)
      switch (typeDate) {
        case "start":
          changeStartDate(selectedDate);
          break;
        case "finished":
          changeEndDate(selectedDate);
          break;
      }
  };

  const onChangeTime = (_event: any, selectedDate?: Date) => {
    setShowT(false);
    if (selectedDate) {
      switch (typeDate) {
        case "start":
          changeStartTime(selectedDate);
          break;
        case "finished":
          changeFinishedTime(selectedDate);
          break;
      }
    }
  };

  return {
    overlay,
    setOverlay,
    overlaySelect,
    setOverlaySelect,
    typeDate,
    setTypeDate,
    overlayColor,
    setOverlayColor,
    overlayType,
    setOverlayType,
    alert,
    setAlert,
    show,
    setShow,
    showT,
    setShowT,
    error,
    setError,
    buttonDelete,
    onChange,
    onChangeTime,
  };
};
