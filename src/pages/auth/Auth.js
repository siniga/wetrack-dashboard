import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import LoaderImg from "../../img/loader.gif";
import "./Auth.css";
import Loader from "../../components/pageloader/Loader";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { BaseUrl } from "../../components/settings/BaseUrl";
import { authToken } from "../../components/settings/Authentication";
import { authUserData } from "../../components/settings/AuthUserData";
import { UserContext } from "../../components/context/UserContext";
import { useLocation } from "react-router-dom";
import BusinessRegitrationForm from "./BusinessRegistrationForm";
import { AddData } from "../../components/settings/api/AddData";

function Auth(props) {
  const navigate = useNavigate();
  const { setSideBar, setTopNav, setCampaignId, setBusinessCampaigns, isAuth } =
    useContext(UserContext);
  const [isMember, setIsMember] = useState(false);
  const [member, setMember] = useState({});
 
  const [isLoading, setIsLoading] = useState(false);
  const [isUserDataAvailable, setIsUserDataAvailable] = useState(false);
  const [page, setPage] = useState(1);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    name: "",
    role_id: 2, //admin
  });

  useEffect(() => {
    setIsMember(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };


  const login = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setIsUserDataAvailable(false);

    axios({
      url: BaseUrl("login"),
      method: "post",
      data: credentials,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setIsLoading(false);
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        getUserBusiness();
      })
      .catch((err) => {
        toast("Something went wrong try again");
        setIsLoading(false);
      });
  };

  const getUserBusiness = () => {
    axios({
      url: BaseUrl("user/" + authUserData().id + "/business"),
      method: "get",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // toast("Congratulation, Lets get started.");
        localStorage.setItem("user_business", JSON.stringify(response.data));

        setCampaignId(0);
        setBusinessCampaigns([]);
        setSideBar(true);
        setTopNav(true);
        navigate("/dashboard");
      })
      .catch((err) => {
        toast("Something went wrong try again");
        setIsLoading(false);
      });
  };

  const switchAuthPages = (page) => {
    switch (page) {
      case 1:
        return (
          <LoginForm
            login={login}
            credentials={credentials}
            handleChange={handleChange}
            setPage={setPage}
          />
        );
        break;
      case 2:
        return (
          <RegisterForm
          setIsLoading={setIsLoading}
            setMember={setMember}
            credentials={credentials}
            setCredentials={setCredentials}
            handleChange={handleChange}
            setPage={setPage}
          />
        );
        break;
      case 3:
        return (
          <BusinessRegitrationForm
          setIsLoading={setIsLoading}
            member={member}
            credentials={credentials}
            setCredentials={setCredentials}
            handleChange={handleChange}
            setIsUserDataAvailable={setIsUserDataAvailable}
            setPage={setPage}
            getUserBusiness={getUserBusiness}
          />
        );
        break;
      default:
        return null;
    }
  };
  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="login main-container">
        <div className="left-sidebar"></div>
        <div className="right-sidebar">
          {isLoading ? (
            <Loader
              loadMsg={"We are getting your data, please wait!"}
              icon={LoaderImg}
            />
          ) : (
            <div>{switchAuthPages(page)}</div>
          )}
        </div>
      </div>
    </>
  );
}

export default Auth;
