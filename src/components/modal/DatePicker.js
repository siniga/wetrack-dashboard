import React, { useState } from "react";
import Backdrop from "../Backdrop";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";


function DatePicker() {
  const [selectedDayRange, setSelectedDayRange] = useState({
    from: null,
    to: null,
  });

  return (
    <>
      <Calendar
        value={selectedDayRange}
        onChange={setSelectedDayRange}
        shouldHighlightWeekends
      />
    </>
  );
}

export default DatePicker;
