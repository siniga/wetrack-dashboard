import React, { useState } from "react";
import contentLoader from '../../img/loader_secondary.gif'

import "./Form.css";
function Form(props) {
  const { children, header, submitForm, submitBtnTxt, isFormLoading } = props;

  return (
    <>
      <form className="form" onSubmit={submitForm}>
        <h3 className="form-header">{header}</h3>
        <hr className="separator" />
        <div className="form-children">{children}</div>

        <button type="submit" className="btn submit-btn">
          {submitBtnTxt}
          {isFormLoading ? <img src={contentLoader} style={{width:20}} /> : null}
        </button>
      </form>
    </>
  );
}

export default Form;
