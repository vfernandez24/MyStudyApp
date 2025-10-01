import {
  classTime,
  event,
  exam,
  grade,
  period,
  subject,
  task,
  teacher,
} from "./types";

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1);
const day = String(today.getDate());
const todayStr = `${year}-${month}-${day}`;

export const defaultEvents: event[] = [
  {
    id: 0,
    type: "personal",
    date: new Date(todayStr),
    allDay: true,
    color: 1,
    name: "Cumpleaños de Ana",
    description: "Celebración en casa a las 18:00.",
  },
  {
    id: 1,
    type: "job",
    date: new Date(todayStr),
    allDay: false,
    subject: 2,
    startTime: new Date(`${todayStr}T10:00:00`),
    finishedTime: new Date(`${todayStr}T11:00:00`),
    color: 2,
    name: "Examen de Matemáticas",
    description: "Temas 5 y 6. Llevar calculadora.",
  },
  {
    id: 2,
    type: "personal",
    date: new Date(todayStr),
    allDay: true,
    color: 3,
    name: "Reunión familiar",
    description: "Comida en casa de los abuelos.",
  },
  {
    id: 3,
    type: "job",
    date: new Date(todayStr),
    allDay: true,
    subject: 1,
    color: 4,
    name: "Prueba de Inglés",
    description: "Listening y Reading.",
  },
  {
    id: 4,
    type: "other",
    date: new Date(todayStr),
    allDay: true,
    color: 5,
    name: "Día sin clases",
    description: "Jornada de puertas abiertas del instituto.",
  },
  {
    id: 5,
    type: "personal",
    date: new Date(todayStr),
    allDay: true,
    color: 6,
    name: "Ir al dentista",
    description: "Cita a las 12:00 en Clínica Dental Ruiz.",
  },
  {
    id: 6,
    type: "other",
    date: new Date(todayStr),
    allDay: true,
    color: 7,
    name: "Recoger uniforme",
    description: "Pasar por la tienda del colegio.",
  },
  {
    id: 7,
    type: "job",
    date: new Date(todayStr),
    allDay: true,
    subject: 3,
    color: 8,
    name: "Examen de Historia",
    description: "Guerras mundiales y Revolución Rusa.",
  },
  {
    id: 8,
    type: "personal",
    date: new Date(todayStr),
    allDay: true,
    color: 9,
    name: "Estudiar con Marta",
    description: "Revisar biología y química.",
  },
  {
    id: 9,
    type: "other",
    date: new Date(todayStr),
    allDay: true,
    color: 10,
    name: "Entrega de proyecto",
    description: "Subir a la plataforma antes de las 23:59.",
  },
];

export const defaultClassTimes: classTime[] = [];

export const defaultGrades: grade[] = [];

export const defaultExams: exam[] = [
  {
    id: 0,
    date: new Date("2025-09-10"),
    allDay: true,
    name: "Examen de funciones",
    subject: 0,
    description: "Incluye funciones lineales, cuadráticas y racionales",
    notifications: [
      { id: "1d", large: "1 día antes", time: 1440 },
      { id: "1h", large: "1 hora antes", time: 60 },
    ],
  },
  {
    id: 1,
    date: new Date("2025-09-12"),
    allDay: false,
    startTime: new Date("2025-09-12T09:00:00"),
    finishedTime: new Date("2025-09-12T10:30:00"),
    name: "Comentario de texto",
    subject: 1,
    description: "Comentario crítico de un texto narrativo",
    notifications: [
      { id: "2d", large: "2 días antes", time: 2880 },
      { id: "30min", large: "30 minutos antes", time: 30 },
    ],
  },
  {
    id: 2,
    date: new Date("2025-08-14"),
    allDay: false,
    startTime: new Date("2025-08-14T11:00:00"),
    finishedTime: new Date("2025-08-14T12:00:00"),
    name: "Listening y Reading",
    subject: 2,
    notifications: [{ id: "1d", large: "1 día antes", time: 1440 }],
  },
  {
    id: 3,
    date: new Date("2025-07-17"),
    allDay: true,
    name: "Examen del sistema digestivo",
    subject: 3,
    notifications: [{ id: "3h", large: "3 horas antes", time: 180 }],
  },
  {
    id: 4,
    date: new Date("2024-09-20"),
    allDay: false,
    startTime: new Date("2024-09-20T08:30:00"),
    finishedTime: new Date("2024-09-20T10:00:00"),
    name: "Guerras Mundiales",
    subject: 4,
    description: "Primera y Segunda Guerra Mundial, causas y consecuencias",
    notifications: [
      { id: "1w", large: "1 semana antes", time: 10080 },
      { id: "1d", large: "1 día antes", time: 1440 },
    ],
  },
  {
    id: 5,
    date: new Date("2024-02-23"),
    allDay: true,
    name: "Examen de cinemática",
    subject: 5,
    notifications: [{ id: "1d", large: "1 día antes", time: 1440 }],
  },
  {
    id: 6,
    date: new Date("2024-09-25"),
    allDay: false,
    startTime: new Date("2024-09-25T12:00:00"),
    finishedTime: new Date("2024-09-25T13:00:00"),
    name: "Reacciones químicas",
    subject: 6,
    description: "Ácidos, bases y tipos de reacciones",
    notifications: [
      { id: "12h", large: "12 horas antes", time: 720 },
      { id: "30min", large: "30 minutos antes", time: 30 },
    ],
  },
  {
    id: 7,
    date: new Date("2025-01-27"),
    allDay: true,
    name: "Mapas y relieve",
    subject: 7,
    notifications: [{ id: "1d", large: "1 día antes", time: 1440 }],
  },
  {
    id: 8,
    date: new Date("2025-05-30"),
    allDay: false,
    startTime: new Date("2025-05-30T10:30:00"),
    finishedTime: new Date("2025-05-30T11:30:00"),
    name: "Resistencia y velocidad",
    subject: 8,
    notifications: [{ id: "2h", large: "2 horas antes", time: 120 }],
  },
  {
    id: 9,
    date: new Date("2026-10-02"),
    allDay: true,
    name: "Teoría del color",
    subject: 9,
    description: "Primarios, secundarios y complementarios",
    notifications: [
      { id: "1w", large: "1 semana antes", time: 10080 },
      { id: "1h", large: "1 hora antes", time: 60 },
    ],
  },
];

export const defaultTasks: task[] = [
  {
    id: 0,
    name: "Hacer deberes de matemáticas",
    finishedDate: new Date("2025-10-02T20:00:00"),
    notifications: [
      { id: "1h", large: "1 hora antes", time: 60 },
      { id: "10min", large: "10 minutos antes", time: 10 },
    ],
    status: "pending",
    subject: 2, // Matemáticas
    description: "Ejercicios de las páginas 45-46",
  },
  {
    id: 1,
    name: "Preparar exposición de historia",
    finishedDate: new Date("2025-10-05T09:00:00"),
    notifications: [
      { id: "1d", large: "1 día antes", time: 1440 },
      { id: "30min", large: "30 minutos antes", time: 30 },
    ],
    status: "inProgress",
    subject: 3, // Historia
    description: "Tema: Revolución Industrial",
  },
  {
    id: 2,
    name: "Ir al dentista",
    finishedDate: new Date("2025-10-07T12:00:00"),
    notifications: [{ id: "3h", large: "3 horas antes", time: 180 }],
    status: "pending",
    subject: "personal",
    description: "Revisión dental en Clínica Ruiz",
  },
  {
    id: 3,
    name: "Entregar proyecto de biología",
    finishedDate: new Date("2025-10-10T23:59:00"),
    notifications: [
      { id: "2d", large: "2 días antes", time: 2880 },
      { id: "6h", large: "6 horas antes", time: 360 },
    ],
    status: "pending",
    subject: 4, // Biología
    description: "Trabajo grupal sobre ecosistemas",
  },
  {
    id: 4,
    name: "Estudiar para examen de inglés",
    finishedDate: new Date("2025-10-12T10:00:00"),
    notifications: [
      { id: "1w", large: "1 semana antes", time: 10080 },
      { id: "1d", large: "1 día antes", time: 1440 },
    ],
    status: "inProgress",
    subject: 1, // Inglés
    description: "Repasar units 3 y 4, practicar listening",
  },
  {
    id: 5,
    name: "Comprar regalo para Ana",
    finishedDate: new Date("2025-10-15T18:00:00"),
    notifications: [{ id: "1d", large: "1 día antes", time: 1440 }],
    status: "completed",
    subject: "personal",
    description: "Cumpleaños de Ana, comprar en el centro",
  },
];

export const defaultTeachers: teacher[] = [
  {
    id: 0,
    name: "Laura",
    surnames: "González Ruiz",
    tel: 612345678,
    email: "laura.gonzalez@ejemplo.com",
    notes: "Responsable del departamento de Ciencias.",
    gender: "female",
  },
  {
    id: 1,
    name: "Carlos",
    surnames: "Martínez López",
    tel: 699112233,
    email: "carlos.martinez@ejemplo.com",
    gender: "male",
  },
  {
    id: 2,
    name: "Ana",
    surnames: "Serrano Gil",
    tel: 620334455,
    email: "ana.serrano@ejemplo.com",
    notes: "Imparte clases de refuerzo por las tardes.",
    gender: "female",
  },
  {
    id: 3,
    name: "Javier",
    surnames: "Moreno Díaz",
    gender: "male",
  },
  {
    id: 4,
    name: "Beatriz",
    surnames: "Navarro Torres",
    email: "beatriz.navarro@ejemplo.com",
    gender: "female",
  },
  {
    id: 5,
    name: "Pablo",
    surnames: "Ortega Ramos",
    tel: 633221144,
    notes: "Tutor de 4º ESO B.",
    gender: "male",
  },
  {
    id: 6,
    name: "Lucía",
    surnames: "Vega Martín",
    email: "lucia.vega@ejemplo.com",
    gender: "female",
  },
  {
    id: 7,
    name: "Miguel",
    surnames: "Fernández Salas",
    gender: "male",
  },
  {
    id: 8,
    name: "Sofía",
    surnames: "Romero Paredes",
    tel: 644556677,
    email: "sofia.romero@ejemplo.com",
    gender: "female",
  },
  {
    id: 9,
    name: "David",
    surnames: "Cano Herrera",
    email: "david.cano@ejemplo.com",
    notes: "Encargado de actividades extraescolares.",
    gender: "male",
  },
];

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
  { id: 0, name: "Matemáticas", color: 3, icon: 5, teacher: 0 },
  { id: 1, name: "Lengua", color: 7, icon: 2, teacher: 1 },
  { id: 2, name: "Inglés", color: 12, icon: 9, teacher: 2 },
  { id: 3, name: "Biología", color: 8, icon: 14, teacher: 3 },
  { id: 4, name: "Historia", color: 1, icon: 6, teacher: 4 },
  { id: 5, name: "Física", color: 11, icon: 10, teacher: 5 },
  { id: 6, name: "Química", color: 4, icon: 12, teacher: 6 },
  { id: 7, name: "Geografía", color: 2, icon: 8, teacher: 7 },
  { id: 8, name: "Educación Física", color: 15, icon: 3, teacher: 8 },
  { id: 9, name: "Arte", color: 6, icon: 0, teacher: 9 },
];
