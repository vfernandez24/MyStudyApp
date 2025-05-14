import { classTime, event, grade, period, subject } from "./types";

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1);
const day = String(today.getDate());
const todayStr = `${year}-${month}-${day}`;

export const defaultEvents: event[] = [
  {
    id: 1,
    type: "personal",
    date: todayStr,
    allDay: true,
    color: 1,
    name: "Cumpleaños de Ana",
    description: "Celebración en casa a las 18:00.",
  },
  {
    id: 2,
    type: "exam",
    date: todayStr,
    allDay: false,
    startTime: "10:00",
    finishedTime: "11:00",
    color: 2,
    name: "Examen de Matemáticas",
    description: "Temas 5 y 6. Llevar calculadora.",
  },
  {
    id: 3,
    type: "personal",
    date: todayStr,
    allDay: true,
    color: 3,
    name: "Reunión familiar",
    description: "Comida en casa de los abuelos.",
  },
  {
    id: 4,
    type: "exam",
    date: todayStr,
    allDay: true,
    color: 4,
    name: "Prueba de Inglés",
    description: "Listening y Reading.",
  },
  {
    id: 5,
    type: "other",
    date: todayStr,
    allDay: true,
    color: 5,
    name: "Día sin clases",
    description: "Jornada de puertas abiertas del instituto.",
  },
  {
    id: 6,
    type: "personal",
    date: todayStr,
    allDay: true,
    color: 6,
    name: "Ir al dentista",
    description: "Cita a las 12:00 en Clínica Dental Ruiz.",
  },
  {
    id: 7,
    type: "other",
    date: todayStr,
    allDay: true,
    color: 7,
    name: "Recoger uniforme",
    description: "Pasar por la tienda del colegio.",
  },
  {
    id: 8,
    type: "exam",
    date: todayStr,
    allDay: true,
    color: 8,
    name: "Examen de Historia",
    description: "Guerras mundiales y Revolución Rusa.",
  },
  {
    id: 9,
    type: "personal",
    date: todayStr,
    allDay: true,
    color: 9,
    name: "Estudiar con Marta",
    description: "Revisar biología y química.",
  },
  {
    id: 10,
    type: "other",
    date: todayStr,
    allDay: true,
    color: 10,
    name: "Entrega de proyecto",
    description: "Subir a la plataforma antes de las 23:59.",
  },
];

export const defaultClassTimes: classTime[] = [];

export const defaultGrades: grade[] = [];

export const defaultPeriods: period[] = [
  {
    id: 0,
    name: "1er Periodo",
  },
  {
    id: 1,
    name: "2o Periodo",
  },
];

export const defaultSubjects: subject[] = [
  { id: 0, name: "Matemáticas", color: 3, icon: 5, teachers: [0] },
  { id: 1, name: "Lengua", color: 7, icon: 2, teachers: [1] },
  { id: 2, name: "Inglés", color: 12, icon: 9, teachers: [2] },
  { id: 3, name: "Biología", color: 8, icon: 14, teachers: [3] },
  { id: 4, name: "Historia", color: 1, icon: 6, teachers: [4] },
  { id: 5, name: "Física", color: 11, icon: 10, teachers: [5] },
  { id: 6, name: "Química", color: 4, icon: 12, teachers: [6] },
  { id: 7, name: "Geografía", color: 2, icon: 8, teachers: [7] },
  { id: 8, name: "Educación Física", color: 15, icon: 3, teachers: [8] },
  { id: 9, name: "Arte", color: 6, icon: 0, teachers: [9] },
];
