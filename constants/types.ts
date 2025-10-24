import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { ColorValue } from "react-native";

export interface notification {
  id:
    | "1min"
    | "5min"
    | "10min"
    | "15min"
    | "30min"
    | "45min"
    | "1h"
    | "2h"
    | "3h"
    | "6h"
    | "12h"
    | "1d"
    | "2d"
    | "3d"
    | "1w";
  large:
    | "1 minuto antes"
    | "5 minutos antes"
    | "10 minutos antes"
    | "15 minutos antes"
    | "30 minutos antes"
    | "45 minutos antes"
    | "1 hora antes"
    | "2 horas antes"
    | "3 horas antes"
    | "6 horas antes"
    | "12 horas antes"
    | "1 día antes"
    | "2 días antes"
    | "3 días antes"
    | "1 semana antes";
  time: number;
}

export interface grade {
  id: number;
  grade: number;
  subject: number; // Subject Id
  date: string;
  period: number; // Period Id
  type: "write" | "oral" | "practical";
  description: string;
  weight: number | null;
}

export interface teacher {
  id: number;
  name: string;
  surnames: string;
  tel?: number;
  email?: string;
  notes?: string;
  gender?: "male" | "female";
}

export interface user {
  username: string;
  tel?: number;
  email: string;
  realName: string;
  realSurname: string;
  dateBirth: string;
}

export interface settings {}

export interface color {
  id: number;
  name: string;
  hex: ColorValue;
  text: ColorValue;
}

export interface icon {
  id: number;
  icon: ReactNode;
  name: keyof typeof MaterialCommunityIcons.glyphMap;
}

export interface period {
  id: number;
  name: string;
  startTime?: Date;
  finishTime?: Date;
}

export interface subject {
  id: number;
  color: number; // Color Id
  icon: number; // Icon Id
  name: string;
  teacher: number | undefined;
}

export interface classTime {
  id: number;
  subject: number; // Subject Id
  startTime: string;
  finalTime: string;
  day: number; // M=0, T=1, W=2 ...
  location?: string;
}

export interface event {
  id: number;
  type: "personal" | "job" | number | "other";
  allDay: boolean;
  startTime: Date;
  finishedTime: Date;
  color: number; // Color Id;
  name: string;
  notifications: notification[];
  description?: string;
  subject?: number; // Subject Id
}

export interface day {
  id: number;
  short: string;
  long: string;
  letter: string;
}

export interface exam {
  id: number;
  date: Date;
  allDay: boolean;
  startTime?: Date | undefined;
  notifications: notification[];
  finishedTime?: Date | undefined;
  name: string;
  description?: string;
  subject: number; // Subject Id
  grade?: number; // Grade Id
}

export interface note {
  id: number;
  name: string;
  createDate: string;
  subject: number | "personal"; // Subject Id
  color: number; // Color Id
}

export interface task {
  id: number;
  name: string;
  finishedDate?: Date;
  notifications: notification[];
  status: "pending" | "inProgress" | "completed";
  subject: number | "personal"; // Subject Id;
  description?: string;
}

export interface file {
  id: number;
  interface: "imported" | "created";
  route: string;
  name: string;
  updateDate: string;
}

export interface ratingSystem {
  id: number;
}

export interface settings {
  language: "";
  theme: "dark" | "light";
  ratingSystem: number; // System Id
}

export interface Transaction {
  id: number;
  amount: number;
  type: "ingreso" | "gasto" | "";
  date: string;
  category: number;
  description: string;
}

export interface Category {
  id: number;
  name: string;
  type: "ingreso" | "gasto";
  icon: string;
  color: string;
  amount: number;
}
