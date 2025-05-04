export type grade = {
  id: number;
  grade: number;
  subject: number; // Subject Id
  date: string;
  period: number; // Period Id
  type: "write" | "oral" | "practical";
};

export type teacher = {
  id: number;
  name: string;
  surnames: string;
  subject: number; // Subject Id
  tel?: number;
  email?: string;
  notes?: string;
};

export type user = {
  username: string;
  tel?: number;
  email: string;
  realName: string;
  realSurname: string;
  dateBirth: string;
};

export type subject = {
  id: number;
  color: number; // Color Id
  icon: number; // Icon Id
  name: string;
  teachers: number[];
};
