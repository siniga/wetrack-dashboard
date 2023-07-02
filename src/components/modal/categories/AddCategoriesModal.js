import React, { useState } from "react";
import { addCategory } from "../../api/Categories";
import Loader from "../../../../src/img/spinner_loader.gif";

function AddCategoriesModal({loginState, axiosInstance, setShowCategoryModal, setNewCategory}) {
  const [isLoading, setIsLoading] = useState(false);

  const [categoryFormData, setCategoryFormData] = useState({name:"", business_id:""})
  
  
  const onAddCategoryClick = async (e) =>{
    e.preventDefault();

    setIsLoading(true)

    const response = await addCategory(categoryFormData, axiosInstance)
    if(response){
     setIsLoading(false)
     setNewCategory(response)
     setShowCategoryModal(false)
     setCategoryFormData({})
    }
    
 }

  const onCancel = () => {
    setShowCategoryModal(false);
  };

  const handleCategoryChange = (e) =>{
    setCategoryFormData({
     ...categoryFormData,
     [e.target.name]: e.target.value,
     business_id: loginState.user.business_id
    })
 }

  return (
    <div id="myModal" className="modal">
      <div class="modal-content">
        <span className="close" onClick={onCancel}>
          &times;
        </span>
        <h1 style={{ fontSize: 22 }}>Select Supervisor</h1>
        <h3>supervisor Details</h3>
        <form onSubmit={onAddCategoryClick}>
          <div className="form-contols-container">
            <div className="input-section" style={{ width: "100%" }}>
              <label htmlFor="name">
                Name:
                <input
                  placeholder="Enter category"
                  // ref={nameRef}
                  type="text"
                  id="name"
                  name="name"
                  value={categoryFormData.name}
                  onChange={handleCategoryChange}
                  // className={nameError ? "invalid" : ""}
                />
              </label>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" className="primary-btn">
              {isLoading && <img src={Loader} width={30} />}
              {!isLoading && <p>Save</p>}
            </button>
            <button type="submit" className="white-btn" onClick={onCancel}>
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCategoriesModal;
