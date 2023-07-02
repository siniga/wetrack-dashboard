import React, { useEffect, useRef, useState } from "react";
import "./Account.css";
import {
  validateEmail,
  validatePhoneNumber,
} from "../../components/helpers/InputValidationHelper";
import {
  updateUserData,
  updateUserPassword,
} from "../../components/api/Users";
import Loader from "../../img/spinner_loader.gif";
import { BaseUrl } from "../../components/settings/BaseUrl";
import axios from "axios";

function Account() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPwdLoading, setIsPwdLoading] = useState(false);
  const [pwdData, setPwdData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [style, setStyle] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneInvalidError, setPhoneInvalidError] = useState("");
  const [passwordError, setPasswordErrorr] = useState("");

  //references
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);

  // Perform email validation
  const isEmailValid = validateEmail(formData.email);
  const isPhoneValid = validatePhoneNumber(formData.phone);

  const BASE_URL = BaseUrl("/");
  const token = localStorage.getItem("token");
  const loggedUser = JSON.parse(localStorage.getItem("user"))

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, //TODO: store token in .env file
    },
  });

  useEffect(() => {
    //initialize logged user data
    setFormData(loggedUser);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.name.trim() === "") {
      setNameError("Required");
      return;
    } else {
      emailRef.current.focus();
      setNameError("");
    }

    if (!isEmailValid) {
      setEmailError("Invalid email address");
      return;
    } else {
      phoneRef.current.focus();
      setEmailError("");
    }

    if (formData.phone.trim() === "") {
      setPhoneInvalidError("Required");
      return;
    } else {
      setPhoneError("");
    }

    if (!isPhoneValid) {
      setPhoneInvalidError("invalid");
      return;
    } else {
      setPhoneInvalidError("");
    }

    setIsLoading(true);
    const response = await updateUserData(axiosInstance,loggedUser.id, formData, setIsLoading);
    if(response){
      setIsLoading(false)
    }

  };

  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    setPwdData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePwdSubmit = async (e) => {
    e.preventDefault();

    if (pwdData.currentPassword.trim() === "") {
      setPasswordErrorr("Current password field can not be empty");
      return;
    }

    if (pwdData.newPassword.trim() === "") {
      setPasswordErrorr("New password field can not be empty");
      return;
    }

    //show loader
    setIsPwdLoading(true);

    const data = await updateUserPassword(axiosInstance,pwdData, setIsPwdLoading);
    if (data.message === "Password updated successfully") {
      setIsPwdLoading(false)
      setStyle({ color: "green" });
    } else {
      setStyle({ color: "red" });
    }
    setPasswordErrorr(data?.message);
  };

  return (
    <div>
      <div className="menu-bar">
        <h1 className="page-header">/ Account Page</h1>
        <div></div>
      </div>
      <div className="page-wrapper">
        <div className="form-container">
          <h1 style={{ fontSize: 22 }}>Account</h1>
          <h3>Personal Information</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-contols-container">
              <div className="input-section">
                <label htmlFor="name">
                  Name:
                  <input
                    ref={nameRef}
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={nameError ? "invalid" : ""}
                  />
                </label>
                <label htmlFor="email">
                  Email:
                  <input
                    ref={emailRef}
                    type="email"
                    id="email"
                    name="email"
                    className={emailError ? "invalid" : ""}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className="input-section">
                <label htmlFor="phone">
                  Phone:
                  <input
                    ref={phoneRef}
                    type="tel"
                    id="phone"
                    name="phone"
                    className={phoneError || phoneInvalidError ? "invalid" : ""}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Role:
                  <div className="role-field">
                    <p>{formData.role}</p>
                  </div>
                  {/* <select
                    ref={roleRef}
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={roleError ? "invalid" : ""}
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="agent">Agent</option>
                  </select> */}
                  {/* {roleError && <div className="error">{roleError}</div>} */}
                </label>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" className="primary-btn">
                {isLoading && <img src={Loader} width={30} />}
                {!isLoading && <p>Update Account</p>}
              </button>
            </div>
          </form>
        </div>
        <div className="form-container">
          <h1 style={{ fontSize: 22 }}>Password</h1>
          <h3>Update your password</h3>
          <form
            onSubmit={handlePwdSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div className="input-section">
              {passwordError && (
                <p className="error" style={style}>
                  {passwordError}
                </p>
              )}
              <label htmlFor="current-password">Current Password:</label>
              <input
                type="password"
                id="current-password"
                name="currentPassword"
                value={pwdData.currentPassword}
                onChange={handlePwdChange}
              />
              <label htmlFor="new-password">New Password:</label>
              <input
                type="password"
                id="new-password"
                name="newPassword"
                value={pwdData.newPassword}
                onChange={handlePwdChange}
              />
              <button
                type="submit"
                className="white-btn"
                style={{ background: "#333", color: "white" }}
              >
                {isPwdLoading ? <img src={Loader} width={30} /> : <p> Update Password</p>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Account;
