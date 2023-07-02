import React from "react";

function TableData(props) {
  const { children, style } = props;
  return (
    <div className="hr-body-item" style={style}>
      {children}
    </div>
  );
}

export default TableData;
