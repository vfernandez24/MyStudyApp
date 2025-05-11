import { ColorValue } from "react-native";
import { color } from "./types";

export const colors: color[] = [
  { id: 1, name: "Rosa pastel", hex: "#F4B7B6" },
  { id: 2, name: "Rosa fuerte pastel", hex: "#EAA6B7" },
  { id: 3, name: "Lila rosado", hex: "#D4A4D5" },
  { id: 4, name: "Lila grisáceo", hex: "#BBA9CC" },
  { id: 5, name: "Lavanda claro", hex: "#C6CCE0" },

  { id: 6, name: "Celeste pastel", hex: "#A5C9E0" },
  { id: 7, name: "Aqua claro", hex: "#84E3EF" },
  { id: 8, name: "Turquesa suave", hex: "#72C9C6" },
  { id: 9, name: "Verde aqua", hex: "#4BD4C4" },
  { id: 10, name: "Verde menta", hex: "#A1C9A3" },

  { id: 11, name: "Verde manzana claro", hex: "#CDE9B7" },
  { id: 12, name: "Verde oliva claro", hex: "#D3D38B" },
  { id: 13, name: "Amarillo pastel", hex: "#FFF199" },
  { id: 14, name: "Naranja claro pastel", hex: "#F9C27B" },
  { id: 15, name: "Blanco", hex: "#FFFFFF" },

  { id: 16, name: "Rojo fuerte", hex: "#E32618" },
  { id: 17, name: "Fucsia neón", hex: "#F91A91" },
  { id: 18, name: "Rosa brillante", hex: "#F984EF" },
  { id: 19, name: "Violeta neón", hex: "#C64BFF" },
  { id: 20, name: "Púrpura fuerte", hex: "#834CFF" },

  { id: 21, name: "Azul medio", hex: "#1D8CFF" },
  { id: 22, name: "Cian brillante", hex: "#35D7FF" },
  { id: 23, name: "Verde fuerte", hex: "#3BCB70" },
  { id: 24, name: "Amarillo mostaza", hex: "#FFC934" },
  { id: 25, name: "Naranja brillante", hex: "#FF7F4D" },
];

interface gradeColor {
  grade: string;
  color: ColorValue;
  text: "#fff" | "#000";
}

export const gradeColors: gradeColor[] = [
  { grade: "0-2.99", color: colors[15].hex, text: "#fff" }, // Rojo
  { grade: "3-4.99", color: colors[24].hex, text: "#fff" }, // Naranja
  { grade: "5-5.99", color: colors[23].hex, text: "#000" }, // Amarillo fuerte
  { grade: "6-6.49", color: colors[12].hex, text: "#000" }, // Amarillo pastel
  { grade: "6.5-7.99", color: colors[11].hex, text: "#000" }, // Verde / amarillo
  { grade: "8-9.49", color: colors[10].hex, text: "#000" }, // Verde claro
  { grade: "9.5-10", color: colors[22].hex, text: "#fff" }, // Verde oscuro
];
