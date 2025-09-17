import { notification } from "./types";

const notificationsDef: notification[] = [
  { id: "1min", large: "1 minuto antes" },
  { id: "5min", large: "5 minutos antes" },
  { id: "10min", large: "10 minutos antes" },
  { id: "15min", large: "15 minutos antes" },
  { id: "30min", large: "30 minutos antes" },
  { id: "45min", large: "45 minutos antes" },
  { id: "1h", large: "1 hora antes" },
  { id: "2h", large: "2 horas antes" },
  { id: "3h", large: "3 horas antes" },
  { id: "6h", large: "6 horas antes" },
  { id: "12h", large: "12 horas antes" },
  { id: "1d", large: "1 día antes" },
  { id: "2d", large: "2 días antes" },
  { id: "3d", large: "3 días antes" },
  { id: "1w", large: "1 semana antes" },
];

export default notificationsDef;
