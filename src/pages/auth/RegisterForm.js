import React, { useState } from "react";
import { useForm } from "react-hook-form";

function RegisterForm(props) {
  const { member,setMember, handleChange, setPage, registerBusiness} = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const registerMember = (data) =>{
    const {name,email, password} = data;
    setMember({...member, name:name, email:email, password:password})
    setPage(3)
  }

  return (
    <>
      <div>
        <h1 className="header">Create Account</h1>
        <p className="sub-header">Lets get started with a free account</p>

        <form onSubmit={handleSubmit((data) => registerMember(data))}>
           <label>Name:</label>
          <input
            {...register("name", { required: true })}
            placeholder={"Enter your name"}
            className="form-input"
          />
          {errors.name && <p>name is required.</p>}
          <label>
            <br />
            Email:
            <input
            {...register("email", { required: true })}
            placeholder={"Enter your email"}
            className="form-input"
            type={"email"}
          />
          {errors.email && <p>email is required.</p>}
          </label>
          <br />
          <label>
          <input
            {...register("password", { required: true })}
            placeholder={"Enter your password"}
            className="form-input"
          />
          {errors.password && <p>name is password.</p>}
          </label>{" "}
          <br />
          <input type="submit" value="Continue" className="submit-btn" />
          <p style={{ marginTop: 10 }}>
            Already have an account?{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => setPage(1)}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </>
  );
}

export default RegisterForm;
