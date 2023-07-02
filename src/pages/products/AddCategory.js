import React, { useState } from "react";
import Card from "../../components/cards/Card";
import Field from "../../components/elements/Field";
import Form from "../../components/elements/Form";
import ImageUploader from "react-images-upload";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BaseUrl } from "../../components/settings/BaseUrl";
import { authToken } from "../../components/settings/Authentication";
import { authUserBusinessData } from "../../components/settings/AuthUserData";

function AddCategory(props) {
  const navigate = useNavigate();
  const [isFormLoading, setIsFormLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const AddCategory = (data) =>{

    let categoryData = {
      name: data.name,
      business_id: authUserBusinessData().business_id
    }
    setIsFormLoading(true);
    axios({
      url: BaseUrl("category"),
      method: "post",
      data: categoryData,
      headers: {
        Authorization: "Bearer " + authToken(),
        // "Content-Type": "application/json",
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        setIsFormLoading(false);
        navigate("/products");
      })
      .catch((error) => {
        setIsFormLoading(false);
      });
  }

  return (
    <div className="page main-page-container ">
      <Card>
        <div
          className="back-btn-wrapper action-btns"
          onClick={() => navigate("/products")}
        >
          <FaArrowLeft />
        </div>
        <Form
          isFormLoading={isFormLoading}
          header={"Add a category"}
          submitBtnTxt={"Add Category"}
          submitForm={handleSubmit((data) => AddCategory(data))}
        >
          <div className="form-layouts form-layout-left">
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder={"Category Name"}
              className="form-input"
            />
            {errors.name && <p>Category name is required.</p>}
            
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default AddCategory;
