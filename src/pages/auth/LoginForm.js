import React,{useEffect} from "react";

function LoginForm(props) {
  const { login, credentials, handleChange, setPage } = props;

//   useEffect(()=>{
//     setIsMember(true);
//   }, [])
  return (
    <>
      <div>
        <h1 className="header">Welcome Back</h1>
        <p className="sub-header">Lets continue from where we left off</p>

        <form onSubmit={login}>
          <label>
            <br />
            Email:
            <br />
            <input
              id="email"
              className="form-input"
              type="text"
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleChange}
            />
            {/* {errors.email && <p>{errors.email}</p>} */}
          </label>
          <br />
          <label>
            Password: <br />
            <input
              id="password"
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
            />
            {/* {errors.password && <p>{errors.password}</p>} */}
          </label>{" "}
          <br />
          <input type="submit" value="Login" className="submit-btn" />
          <p style={{ marginTop: 10 }}>
            If you are not yet a membert? {" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => setPage(2)}
            >
              SignUp
            </span>
          </p>
        </form>
      </div>
    </>
  );
}

export default LoginForm;
