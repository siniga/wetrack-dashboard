import React, { useState } from "react";
import Loader from "../../../src/img/spinner_loader.gif";
import { deleteProduct } from "../api/Products";

function DeleteItemModal(props) {
  const {
    arrayData,
    showDeleteModal,
    setShowDeleteModal,
    itemToDelete,
    axiosInstance,
    itemToDeleteIndex,
  } = props;

  //TODO: make sure items are not parmanently deleted
  const [isLoading, setIsloading] = useState(false);

  const onCancel = (e) => {
    e.preventDefault();
    setShowDeleteModal(false);
  };

  const deleteItem = async (e) => {
    e.preventDefault();

    setIsloading(true);
    const response = await deleteProduct(axiosInstance, itemToDelete.id);
    if (response) {
      setIsloading(false);
      setShowDeleteModal(false);
      arrayData.splice(itemToDeleteIndex, 1)
    }
  };
  return (
    <>
      {showDeleteModal && (
        <div id="myModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={onCancel}>
              &times;
            </span>
            <h1 style={{ fontSize: 22 }}>Select Item</h1>
            <h3>
              This item will be deleted parmanently, are you sure you want to
              delete it?
            </h3>
            <form onSubmit={deleteItem}>
              <div className="form-contols-container"></div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" className="primary-btn">
                  {isLoading && <img src={Loader} width={30} />}
                  {!isLoading && <p>Delete</p>}
                </button>
                <button type="button" className="white-btn" onClick={onCancel}>
                  cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default DeleteItemModal;
