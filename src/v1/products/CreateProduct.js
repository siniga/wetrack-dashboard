import React, { useContext, useEffect, useRef, useState } from "react";
import Loader from "../../../src/img/spinner_loader.gif";
import { BaseUrl } from "../../components/settings/BaseUrl";
import axios from "axios";
import { addProduct } from "../../components/api/Products";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../components/api/Categories";

function CreateProduct() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [userInputData, setuserInputData] = useState({
    name: "",
    price: "",
    cost: "",
    stock: "",
    category_id: "",
  });

  const { loginState } = useContext(AuthContext);

  const [nameError, setNameErrror] = useState("");
  const [priceError, setPriceError] = useState("");
  const [costError, setCostError] = useState("");
  const [stockError, setStockError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [selectedFileError, setSelectedFileError] = useState("");

  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const costRef = useRef(null);
  const stockRef = useRef(null);
  const categoryRef = useRef(null);

  //TODO: put all this in a different file to dicouple
  //them from this file
  const token = localStorage.getItem("token");
  const BASE_URL = BaseUrl("/");

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      // "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const categoryData = await fetchCategories(axiosInstance, loginState.user.business_id);
      if (categoryData) {
        setCategories(categoryData);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setuserInputData({
      ...userInputData,
      business_id: loginState.user?.business_id,
    });
  }, []);

  const handleChange = (e) => {
    setuserInputData({ ...userInputData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (userInputData.name.trim() === "") {
      setNameErrror("Name is required");
      return;
    } else {
      setNameErrror("");
      priceRef.current.focus();
    }

    if (userInputData.price.trim() === "") {
      setPriceError("Price is required");
      return;
    } else {
      setPriceError("");
      costRef.current.focus();
    }

    if (userInputData.cost.trim() === "") {
      setCostError("Cost is required");
      return;
    } else {
      setCostError("");
      stockRef.current.focus();
    }

    if (userInputData.stock.trim() === "") {
      setStockError("Stock is required");
      return;
    } else {
      setStockError("");
      categoryRef.current.focus();
    }

    if (userInputData.category_id.trim() === "") {
      setCategoryError("Category is required");
      return;
    } else {
      setCategoryError("");
    }

    if (!selectedFile) {
      setSelectedFileError("Product image is required");

      return;
    }

    setIsLoading(true);


    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('name', userInputData.name);
    formData.append('cost', userInputData.cost);
    formData.append('price', userInputData.price);
    formData.append('stock', userInputData.stock);
    formData.append('business_id', userInputData.business_id);
    formData.append('category_id', userInputData.category_id);
    
    console.log(selectedFile);

    const response = await addProduct(axiosInstance, formData);
    if (response) {
      setIsLoading(false);
 
      navigate("/products");
    }
  };

  return (
    <div>
      <div className="menu-bar">
        <h1 className="page-header">/ Create Product</h1>
        <div></div>
      </div>
      <div className="page-wrapper">
        <div className="form-container">
          <h1 style={{ fontSize: 22 }}>New Product</h1>
          <h3>Product Details</h3>
          <form onSubmit={onSubmitForm}>
            <div className="form-contols-container">
              <div className="input-section">
                <label htmlFor="name">
                  Name:
                  <input
                    placeholder="Enter product name"
                    ref={nameRef}
                    type="text"
                    id="name"
                    name="name"
                    value={userInputData.name}
                    onChange={handleChange}
                    className={nameError ? "invalid" : ""}
                  />
                  {nameError && (
                    <p className="error error-right">{nameError}</p>
                  )}
                </label>
                <label htmlFor="email">
                  Price:
                  <input
                    placeholder="Enter price"
                    ref={priceRef}
                    type="number"
                    id="price"
                    name="price"
                    className={priceError ? "invalid" : ""}
                    value={userInputData.price}
                    onChange={handleChange}
                  />
                  {priceError && (
                    <p className="error error-right">{priceError}</p>
                  )}
                </label>
                <label htmlFor="phone">
                  Cost:
                  <input
                    placeholder="Enter cost"
                    ref={costRef}
                    type="number"
                    id="cost"
                    name="cost"
                    className={costError ? "invalid" : ""}
                    value={userInputData.cost}
                    onChange={handleChange}
                  />
                  {costError && (
                    <p className="error error-right">{costError}</p>
                  )}
                </label>
              </div>
              <div className="input-section">
                <label htmlFor="phone">
                  Stock:
                  <input
                    placeholder="Enter stock"
                    ref={stockRef}
                    type="number"
                    id="stock"
                    name="stock"
                    className={stockError ? "invalid" : ""}
                    value={userInputData.phone}
                    onChange={handleChange}
                  />
                  {stockError && (
                    <p className="error error-right">{stockError}</p>
                  )}
                </label>
                <label>
                  Category:
                  <select
                    ref={categoryRef}
                    name="category_id"
                    value={userInputData.category_id}
                    onChange={handleChange}
                    className={categoryError ? "invalid" : ""}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category, index) => {
                      return (
                        <option key={index} value={category.id}>
                          {category.name}
                        </option>
                      );
                    })}
                    {/* <option value="1">Beer</option>
                    <option value="2">Flour</option> */}
                  </select>
                  {categoryError && (
                    <div className="error error-right">{categoryError}</div>
                  )}
                </label>
                <label>
                  Image:
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className={selectedFileError ? "invalid" : ""}
                  />
                </label>
              </div>
              {selectedFile && (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected"
                  style={{ maxWidth: "25%" }}
                />
              )}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" className="primary-btn">
                {isLoading && <img src={Loader} width={30} />}
                {!isLoading && <p>Save</p>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
