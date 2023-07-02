import React, { useContext, useEffect, useState } from "react";
import Card from "../../components/cards/Card";
import Field from "../../components/elements/Field";
import Form from "../../components/elements/Form";
import ImageUploader from "react-images-upload";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../components/settings/BaseUrl";
import { authToken } from "../../components/settings/Authentication";
import Select from "react-select";
import { UserContext } from "../../components/context/UserContext";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

function AddTeamMember(props) {
  const { campaignId,setActiveLink } = useContext(UserContext);
  //img uploader
  const [pictures, setPictures] = useState([]);
  const [teams, setTeams] = useState([]);
  const [roles, setRoles] = useState([]);
  const [serverErrors, setServerError] = useState([]);
  const [isFormLoading, setIsFormLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  useEffect(() => {
    getTeams();
    getRoles();
  }, [campaignId]);


  const getTeams = () => {
    axios({
      url: BaseUrl("teams/campaign/" + campaignId),
      method: "get",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setTeams(response.data);
      })
      .catch((err) => {});
  };
  const getRoles = (e) => {
    axios({
      url: BaseUrl("roles"),
      method: "get",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setRoles(response.data);
      })
      .catch((err) => {});
  };

  const AddTeamMember = (data) => {
    setIsFormLoading(true)
    axios({
      url: BaseUrl("user"),
      method: "post",
      data: data,
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setIsFormLoading(false)
        navigate("/users");
      })
      .catch((error) => {
        setIsFormLoading(false)
        if(error.response.data.errors)
        toast(error.response.data.errors);
        setServerError(error.response.data.errors)
      });
  };

  const onDrop = (picture) => {
    setPictures([...pictures, picture]);
  };

  return (
    <div className="page main-page-container ">
      <Card>
        <div
          className="back-btn-wrapper action-btns"
          onClick={() => navigate("/users")}
        >
          <FaArrowLeft />
        </div>
        <Form
        isFormLoading={isFormLoading}
          header={"Add a team member"}
          submitBtnTxt={"Add Team Member"}
          // submitForm={AddTeamMember}
          submitForm={handleSubmit((data) => AddTeamMember(data))}
        >
          <div className="form-layouts form-layout-left">
            <input
              {...register("name", { required: true })}
              placeholder={"Fullname"}
              className="form-input"
            />
            {errors.name && <p>Fullname is required.</p>}
            <input
              {...register("email", { required: true })}
              placeholder={"Email"}
            />
            {errors.email && <p>Email name is required.</p>}
            <input
              {...register("phone", { required: true })}
              placeholder={"Phone number"}
            />
            {errors.phone && <p>Last name is required.</p>}
          </div>
          <div className="form-layouts form-layout-right">
           <div style={{display:"flex"}}>
           <select {...register("team_id", { required: true })} className="form-input">
              <option value={""}>Select Team</option>
              {teams && teams.map((team, index)=>{
                 return <option key={index} value={team.id}>{team.name}</option>
              })}
            </select>
            <p style={{fontSize:11, width:100,display:"flex",alignItems:"center",paddingLeft:20,color:"#ff6600", cursor:"pointer"}}
            onClick={()=>{
              setActiveLink('teams')
              navigate("/add-team")
            }}>New Team</p>
           </div>

            <select {...register("role_id", { required: true })} className="form-input">
            <option value={""}>Select Role</option>
              {roles && roles.map((role, index)=>{
                 return <option key={index} value={role.id}>{role.name}</option>
              })}
            </select>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default AddTeamMember;
