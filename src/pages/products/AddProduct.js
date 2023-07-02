import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import ImageUploader from "react-images-upload";
import "./Products.css";
import Form from "../../components/elements/Form";
import Field from "../../components/elements/Field";
import { Checkbox } from "../../components/elements/Checkbox";
import Card from "../../components/cards/Card";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BaseUrl } from "../../components/settings/BaseUrl";
import { authToken } from "../../components/settings/Authentication";
import { authUserBusinessData } from "../../components/settings/AuthUserData";
import { useDropzone } from "react-dropzone";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

function AddProduct(props) {
  const navigate = useNavigate();
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [product, setProduct] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { getRootProps, getInputProps,  isFocused, isDragAccept, isDragReject } = useDropzone({
    accept: {
      "image/*": [],
      // onDrop: files => console.log(files)
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
  };

  const focusedStyle = {
    borderColor: "#2196f3",
  };

  const acceptStyle = {
    borderColor: "#00e676",
  };

  const rejectStyle = {
    borderColor: "#ff1744",
  };


  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = () => {
    axios({
      url: BaseUrl("categories/business/" + authUserBusinessData().business_id),
      method: "get",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((err) => {});
  };


  const addProduct = (data) => {

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("name", data.name);
    formData.append("cost", data.cost);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("category_id", data.category_id);

    setIsFormLoading(true);
    axios({
      url: BaseUrl("product"),
      method: "post",
      data: formData,
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
  };
  return (
    <>
      <div className="page main-page-container add-product-container">
        <Card>
          <div
            className="back-btn-wrapper action-btns"
            onClick={() => navigate("/products")}
          >
            <FaArrowLeft />
          </div>
          <Form
            isFormLoading={isFormLoading}
            header={"Add a product"}
            submitBtnTxt={"Add Product"}
            submitForm={handleSubmit((data) => addProduct(data))}
          >
            <div className="form-layouts form-layout-left">
              <input
                type="text"
                {...register("name", { required: true })}
                placeholder={"Product Name"}
                className="form-input"
              />
              {errors.name && <p>Product name is required.</p>}
              <input
                type="number"
                {...register("cost", { required: true })}
                placeholder={"Cost"}
                className="form-input"
              />
              {errors.cost && <p>Cost is required.</p>}
              <input
                type="number"
                {...register("price", { required: true })}
                placeholder={"Price"}
                className="form-input"
              />
              {errors.price && <p>Price is required.</p>}
              <section className="container" style={{paddingLeft:0,marginTop:6}}>
                <div {...getRootProps({ className: "dropzone" , style})}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
                <aside style={thumbsContainer}>{thumbs}</aside>
              </section>
            </div>

            <div className="form-layouts form-layout-right">
            <input
                type="number"
                {...register("stock", { required: true })}
                placeholder={"stock"}
                className="form-input"
              />
              {errors.stock && <p>Product name is required. put 0 if you dont have stock yet</p>}
              <select
                {...register("category_id", { required: true })}
                className="form-input"
              >
                <option value={""}>Select Category</option>
                {categories &&
                  categories.map((category, index) => {
                    return (
                      <option key={index} value={category.id}>
                        {category.name}
                      </option>
                    );
                  })}
              </select>
              {errors.category_id && <p>Select Category.</p>}
              <br />
              {/* <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#666",
                  fontSize: 14,
                }}
              >
                <Checkbox />
                <span> Uncheck to remove product from listing</span>
              </p> */}
            </div>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default AddProduct;
