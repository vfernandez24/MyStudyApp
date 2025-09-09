import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { ColorValue } from "react-native";

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
  teacher: number;
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
  type: "personal" | "job" | "other";
  date: string;
  allDay: boolean;
  startTime?: string;
  finishedTime?: string;
  color: number; // Color Id;
  name: string;
  description?: string;
  subject?: number; // Subject Id
  grade?: number; // Grade Id
}

export interface exam {
  id: number;
  date: Date;
  allDay: boolean;
  startTime?: Date | undefined;
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
  finishedDate?: string;
  status: "pendient" | "inProgress" | "completed";
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
