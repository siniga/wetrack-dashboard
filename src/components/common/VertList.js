import React from "react";
import "./List.css";

function VertList(props) {
  const { children, showBorder, onClick, key, color, background, radius } =
    props;
  return (
    <>
      <li
        key={key}
        className="vertical-li"
        style={
          showBorder
            ? {
                borderTop: "1px #e8e7e7 solid",
                color: color,
                background: background,
                borderRadius: radius,
              }
            : {
                border: "none",
                color: color,
                background: background,
                borderRadius: radius,
              }
        }
        onClick={onClick}
      >
        {children}
      </li>
    </>
  );
}

export default VertList;
