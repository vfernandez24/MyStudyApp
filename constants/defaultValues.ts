import { classTime, event, grade, period, subject, teacher } from "./types";

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1);
const day = String(today.getDate());
const todayStr = `${year}-${month}-${day}`;

export const defaultEvents: event[] = [
  {
    id: 0,
    type: "personal",
    date: todayStr,
    allDay: true,
    color: 1,
    name: "Cumpleaños de Ana",
    description: "Celebración en casa a las 18:00.",
  },
  {
    id: 1,
    type: "exam",
    date: todayStr,
    allDay: false,
    subject: 2,
    startTime: "10:00",
    finishedTime: "11:00",
    color: 2,
    name: "Examen de Matemáticas",
    description: "Temas 5 y 6. Llevar calculadora.",
  },
  {
    id: 2,
    type: "personal",
    date: todayStr,
    allDay: true,
    color: 3,
    name: "Reunión familiar",
    description: "Comida en casa de los abuelos.",
  },
  {
    id: 3,
    type: "exam",
    date: todayStr,
    allDay: true,
    subject: 1,
    color: 4,
    name: "Prueba de Inglés",
    description: "Listening y Reading.",
  },
  {
    id: 4,
    type: "other",
    date: todayStr,
    allDay: true,
    color: 5,
    name: "Día sin clases",
    description: "Jornada de puertas abiertas del instituto.",
  },
  {
    id: 5,
    type: "personal",
    date: todayStr,
    allDay: true,
    color: 6,
    name: "Ir al dentista",
    description: "Cita a las 12:00 en Clínica Dental Ruiz.",
  },
  {
    id: 6,
    type: "other",
    date: todayStr,
    allDay: true,
    color: 7,
    name: "Recoger uniforme",
    description: "Pasar por la tienda del colegio.",
  },
  {
    id: 7,
    type: "exam",
    date: todayStr,
    allDay: true,
    subject: 3,
    color: 8,
    name: "Examen de Historia",
    description: "Guerras mundiales y Revolución Rusa.",
  },
  {
    id: 8,
    type: "personal",
    date: todayStr,
    allDay: true,
    color: 9,
    name: "Estudiar con Marta",
    description: "Revisar biología y química.",
  },
  {
    id: 9,
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

export const defaultTeachers: teacher[] = [
  {
    id: 0,
    name: "Laura",
    surnames: "González Ruiz",
    tel: 612345678,
    email: "laura.gonzalez@ejemplo.com",
    notes: "Responsable del departamento de Ciencias.",
  },
  {
    id: 1,
    name: "Carlos",
    surnames: "Martínez López",
    tel: 699112233,
    email: "carlos.martinez@ejemplo.com",
  },
  {
    id: 2,
    name: "Ana",
    surnames: "Serrano Gil",
    tel: 620334455,
    email: "ana.serrano@ejemplo.com",
    notes: "Imparte clases de refuerzo por las tardes.",
  },
  {
    id: 3,
    name: "Javier",
    surnames: "Moreno Díaz",
  },
  {
    id: 4,
    name: "Beatriz",
    surnames: "Navarro Torres",
    email: "beatriz.navarro@ejemplo.com",
  },
  {
    id: 5,
    name: "Pablo",
    surnames: "Ortega Ramos",
    tel: 633221144,
    notes: "Tutor de 4º ESO B.",
  },
  {
    id: 6,
    name: "Lucía",
    surnames: "Vega Martín",
    email: "lucia.vega@ejemplo.com",
  },
  {
    id: 7,
    name: "Miguel",
    surnames: "Fernández Salas",
  },
  {
    id: 8,
    name: "Sofía",
    surnames: "Romero Paredes",
    tel: 644556677,
    email: "sofia.romero@ejemplo.com",
  },
  {
    id: 9,
    name: "David",
    surnames: "Cano Herrera",
    email: "david.cano@ejemplo.com",
    notes: "Encargado de actividades extraescolares.",
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
