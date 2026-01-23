import InProcess from "@/assets/icons/circle-half-stroke-solid-full.svg";
import Pending from "@/assets/icons/circle-regular-full.svg";
import Completed from "@/assets/icons/circle-solid-full.svg";
import { status } from "./types";

const statusType: status[] = [
  {
    id: 0,
    status: "pending",
    icon: <Pending height={30} width={25} fill="#555" />,
    text: "Pendiente",
  },
  {
    id: 1,
    status: "inProgress",
    icon: <InProcess height={30} width={25} fill="#0b0279" />,
    text: "En proceso",
  },
  {
    id: 2,
    status: "completed",
    icon: <Completed height={30} width={25} fill="#078829" />,
    text: "Completado",
  },
];

export default statusType;
