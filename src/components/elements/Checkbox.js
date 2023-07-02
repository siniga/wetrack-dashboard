import React, { useState } from "react";
import "./Checkbox.css";
export const Checkbox = () => {
  const [isChecked, setIsChecked] = useState(false);

  const checkHandler = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="checkbox">
      <label class="container">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={checkHandler}
          id="checkboxOneInput"
        />
        <span class="checkmark"></span>
      </label>
    </div>
  );
};
