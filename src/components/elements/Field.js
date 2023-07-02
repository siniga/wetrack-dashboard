import React from "react";

import "./Elements.css";

function Field(props) {
  const { type, placeholder, label, handleChange, name, value } = props;
  return (
    <>
      <div className="input-field-wrapper">
        <label>{label}</label>
        <input
          type={type}
          placeholder={placeholder}
          className="form-input"
          name={name}
          value={value}
          onChange={handleChange}
        />
      </div>
    </>
  );
}

export default Field;
