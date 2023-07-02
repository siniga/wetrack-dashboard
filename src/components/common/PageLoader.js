import React from "react";
import Loader from "../../img/spinner_loader.gif";

function PageLoader() {
  return (
    <div
      style={{
        background: "white",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 99,
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
      }}
    >
      <img src={Loader}  style={{width:80, height:80}}/>
    </div>
  );
}

export default PageLoader;
