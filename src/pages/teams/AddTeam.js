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
import { useForm } from "react-hook-form";
import { authUserBusinessData } from "../../components/settings/AuthUserData";
import { UserContext } from "../../components/context/UserContext";

function AddTeam(props) {
  const { businessCampaigns } = useContext(UserContext);
  const [regions, setRegions] = useState();
  const [isFormLoading, setIsFormLoading] = useState(false)
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(()=>{
    getRegions()
  },[])

  const getRegions = () => {
    axios({
      url: BaseUrl("regions"),
      method: "get",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setRegions(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const AddTeam = (data) => {
    setIsFormLoading(true);
    axios({
      url: BaseUrl("team"),
      method: "post",
      data: data,
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setIsFormLoading(false);
        navigate("/teams");
      })
      .catch((error) => {
        setIsFormLoading(false);
        // if (error.response.data.errors) toast(error.response.data.errors);
        // setServerError(error.response.data.errors);
      });
  };

  return (
    <div className="page main-page-container ">
      <Card>
        <div
          className="back-btn-wrapper action-btns"
          onClick={() => navigate("/teams")}
        >
          <FaArrowLeft />
        </div>
        <Form
          isFormLoading={isFormLoading}
          header={"Add a team"}
          submitBtnTxt={"Add Team"}
          submitForm={handleSubmit((data) => AddTeam(data))}
        >
          <div className="form-layouts form-layout-left">
            <input
              {...register("name", { required: true })}
              placeholder={"Team Name"}
              className="form-input"
            />
            {errors.name && <p>Team name is required.</p>}

            <select
              {...register("campaign_id", { required: true })}
              className="form-input"
            >
              <option value={""}>Select Campaign</option>
              {businessCampaigns.campaigns && businessCampaigns.campaigns.map((campaign, index)=>{
                 return <option key={index} value={campaign.id}>{campaign.name}</option>
              })}
            </select>
            {errors.campaign_id && <p>Select Campaign.</p>}

            <select
              {...register("region_id", { required: true })}
              className="form-input"
            >
              <option value={""}>Select Region</option>
              {regions && regions.map((region, index)=>{
                 return <option key={index} value={region.id}>{region.label}</option>
              })}
            </select>
            {errors.region_id && <p>Select Region.</p>}

          </div>
          <div className="form-layouts form-layout-right">
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default AddTeam;
