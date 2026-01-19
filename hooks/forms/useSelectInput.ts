import { useState } from "react";
import {notification, gender, typeGrade, status, typeEvents} from "@/constants/types";

const useSelectInput = () => {
  const [selected, setSelected] = useState<number | undefined>(-1);
    const [genderSelected, setGenderSelected] = useState<gender>(
      genderDef,
    );
    const [typeSelected, setTypeSelected] = useState<
      "write" | "oral" | "practical"
    >(typeGradeDef);
    const [statusSelected, setStatusSelected] = useState<
      "pending" | "inProgress" | "completed"
    >(statusDef);
    const [typeEvSelected, setTypeEvSelected] = useState<
      "school" | "job" | "personal" | "other"
    >("school");
    const [notificationsSelected, setNotificationsSelected] =
      useState<notification[]>(notifications);
      
  return ()
}

export default useSelectInput