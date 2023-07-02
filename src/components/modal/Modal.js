import React, { useEffect, useState } from "react";
import Backdrop from "../Backdrop";
import { Button } from "../elements/Button";
import contentLoader from '../../img/loader_secondary.gif'
import "./Modal.css";

function Modal(props) {
  const {
    isDataChanged,
    children,
    header,
    showBackDrop,
    style,
    showModal,
    setShowModal,
    continueAction,
    isModalLoading,
    showContinueBtn
  } = props;


  const cancelModal = () =>{
    setShowModal(false)
  }

  return (
    <>
      {showModal ? (
        <div>
          {showBackDrop ? <Backdrop /> : null}
          <div className="app-modal" style={style}>
            <div className="modal-wrapper" style={{ display: "block" }}>
              <h2>{header}</h2>
              {children}
              <div className="modal-footer">
                <Button buttonStyle={"btn--outline"} onClick={cancelModal}>Cancel</Button>
               {showContinueBtn ?  <Button buttonStyle={"btn--primary"} onClick={continueAction}>
                  Continue  {isModalLoading ? <img src={contentLoader} style={{width:15}} /> : null}
                  </Button> : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Modal;
