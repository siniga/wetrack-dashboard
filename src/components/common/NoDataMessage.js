import React from "react";
import "./NoDataMessage.css";

function NoDataMessage(props) {
  const { children } = props;
  return (
    <div className="message-wrapper">
      <p className="message">{children}</p>
    </div>
  );
}

export default NoDataMessage;
