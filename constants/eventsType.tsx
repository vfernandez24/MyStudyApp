import School from "@/assets/icons/book-solid-full.svg";
import Job from "@/assets/icons/briefcase-solid-full.svg";
import Others from "@/assets/icons/circle-question-regular-full.svg";
import Personal from "@/assets/icons/user-solid.svg";
import { typeEvents } from "./types";

const eventsType: typeEvents[] = [
  {
    id: 0,
    text: "Escuela",
    value: "school",
    icon: <School height={30} width={30} fill={"#0b0279"} />,
  },
  {
    id: 1,
    text: "Personal",
    value: "personal",
    icon: <Personal height={30} width={30} fill={"#0b0279"} />,
  },
  {
    id: 2,
    text: "Trabajo",
    value: "job",
    icon: <Job height={30} width={30} fill={"#0b0279"} />,
  },
  {
    id: 3,
    text: "Otros",
    value: "other",
    icon: <Others height={30} width={30} fill={"#0b0279"} />,
  },
];

export default eventsType;
