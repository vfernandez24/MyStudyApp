import PageTitle from "@/components/common/PageTitle";
import React, { useState } from "react";
import { ScrollView } from "react-native";

const calendar = () => {
  const today = new Date();
  function daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }
  const daysInThisMonth = daysInMonth(today.getFullYear(), today.getMonth());

  const [selected, setSelected] = useState<Date>(today);

  return (
    <>
      <ScrollView>
        <PageTitle title="CALENDARIO" />
      </ScrollView>
    </>
  );
};

export default calendar;
