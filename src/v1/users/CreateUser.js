import React, { useEffect, useRef, useState } from "react";
import Loader from "../../../src/img/spinner_loader.gif";
import { generateRandomNumber } from "../../components/helpers/Helpers";
import { addUserData } from "../../components/api/Users";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../../components/settings/BaseUrl";
import axios from "axios";

function CreateUser() {
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
  });
  const [updateFormData, setUpdateFormData] = useState(false);

  const [firstNameError, setFirstNameErrror] = useState("");
  const [lastNameError, setLastNameErrror] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [roleError, setRoleError] = useState("");

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const roleRef = useRef();

  const BASE_URL = BaseUrl("/");
  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, //TODO: store token in .env file
    },
  });

  useEffect(() => {
    const rand = generateRandomNumber();
    //add random password to the form object
    setFormData({
      ...formData,
      ["password"]: rand,
      ["code"]: rand,
      business_id: loggedUser.business_id,
      active_status: 0,//user is not active when added
    });
    setUpdateFormData(false);
  }, [updateFormData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (formData.first_name.trim() === "") {
      setFirstNameErrror("First name is required");
      return;
    } else {
      setFirstNameErrror("");
      lastNameRef.current.focus();
    }

    if (formData.last_name.trim() === "") {
      setLastNameErrror("Last name is required");
      return;
    } else {
      setLastNameErrror("");
      emailRef.current.focus();
    }

    if (formData.email.trim() === "") {
      setEmailError("Email is required");
      return;
    } else {
      setEmailError("");
      phoneRef.current.focus();
    }

    if (formData.phone.trim() === "") {
      setPhoneError("Phone is required");
      return;
    } else {
      setPhoneError("");
      roleRef.current.focus();
    }

    if (formData.role.trim() === "") {
      setRoleError("Role is required");
      return;
    } else {
      setRoleError("");
    }

    setUpdateFormData(true);
    setIsLoading(true);

    const response = await addUserData(axiosInstance,formData);
    if (response) {
      setIsLoading(false);
      if (response.error === "emailexist") {
        setEmailError("email exists, try a different one");
        return;
      }

      if (response.error === "phoneexist") {
        setPhoneError("Phone exists, try a different one");
        return;
      }

      navigate("/users");
    }
  };
  return (
    <div>
      <div className="menu-bar">
        <h1 className="page-header">/ Create User</h1>
        <div></div>
      </div>
      <div className="page-wrapper">
        <div className="form-container">
          <h1 style={{ fontSize: 22 }}>New User</h1>
          <h3>User Details</h3>
          <form onSubmit={onSubmitForm}>
            <div className="form-contols-container">
              <div className="input-section">
                <label htmlFor="name">
                  Firstname:
                  <input
                    placeholder="Enter firstname"
                    ref={firstNameRef}
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    // className={nameError ? "invalid" : ""}
                  />
                  {firstNameError && (
                    <p className="error error-right">{firstNameError}</p>
                  )}
                </label>
                <label htmlFor="email">
                  Email:
                  <input
                    placeholder="Enter email"
                    ref={emailRef}
                    type="email"
                    id="email"
                    name="email"
                    // className={emailError ? "invalid" : ""}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {emailError && (
                    <p className="error error-right">{emailError}</p>
                  )}
                </label>
              </div>
              <div className="input-section">
                <label htmlFor="name">
                  Last Name:
                  <input
                    placeholder="Enter lastname"
                    ref={lastNameRef}
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    // className={nameError ? "invalid" : ""}
                  />
                  {lastNameError && (
                    <p className="error error-right">{lastNameError}</p>
                  )}
                </label>
                <label htmlFor="phone">
                  Phone:
                  <input
                    placeholder="Enter phone"
                    ref={phoneRef}
                    type="tel"
                    id="phone"
                    name="phone"
                    // className={phoneError || phoneInvalidError ? "invalid" : ""}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {phoneError && (
                    <p className="error error-right">{phoneError}</p>
                  )}
                </label>
              </div>
            </div>
            <div>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "74%",
                }}
              >
                Role:
                <select
                  ref={roleRef}
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  // className={roleError ? "invalid" : ""}
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="supervisor">Surpervisor</option>
                  <option value="agent">Agent</option>
                </select>
                {roleError && (
                  <div className="error error-right">{roleError}</div>
                )}
              </label>
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

export default CreateUser;
