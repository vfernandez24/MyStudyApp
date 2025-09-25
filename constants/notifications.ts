import { notification } from "./types";

const notificationsDef: notification[] = [
  { id: "1min", large: "1 minuto antes", time: 1 * 60 * 1000 },
  { id: "5min", large: "5 minutos antes", time: 5 * 60 * 1000 },
  { id: "10min", large: "10 minutos antes", time: 10 * 60 * 1000 },
  { id: "15min", large: "15 minutos antes", time: 15 * 60 * 1000 },
  { id: "30min", large: "30 minutos antes", time: 30 * 60 * 1000 },
  { id: "45min", large: "45 minutos antes", time: 45 * 60 * 1000 },
  { id: "1h", large: "1 hora antes", time: 1 * 60 * 60 * 1000 },
  { id: "2h", large: "2 horas antes", time: 2 * 60 * 60 * 1000 },
  { id: "3h", large: "3 horas antes", time: 3 * 60 * 60 * 1000 },
  { id: "6h", large: "6 horas antes", time: 6 * 60 * 60 * 1000 },
  { id: "12h", large: "12 horas antes", time: 12 * 60 * 60 * 1000 },
  { id: "1d", large: "1 día antes", time: 1 * 24 * 60 * 60 * 1000 },
  { id: "2d", large: "2 días antes", time: 2 * 24 * 60 * 60 * 1000 },
  { id: "3d", large: "3 días antes", time: 3 * 24 * 60 * 60 * 1000 },
  { id: "1w", large: "1 semana antes", time: 1 * 7 * 24 * 60 * 60 * 1000 },
];

export default notificationsDef;
