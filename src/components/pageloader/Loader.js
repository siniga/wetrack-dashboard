import React from "react";
import './Loader.css'

function Loader({ loadMsg, loadImg, isLoading}) {
  return (
    <>
      {isLoading ? (
        <div  className="loader-main">
          <img src={loadImg} style={{ width: 60 }} />
          {loadMsg}
        </div>
      ) : null}
    </>
  );
}

export default Loader;
