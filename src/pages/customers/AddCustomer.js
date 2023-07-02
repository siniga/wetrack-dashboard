import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import ImageUploader from "react-images-upload";
import "../../pages/Pages.css";
import Field from "../../components/elements/Field";
import { Checkbox } from "../../components/elements/Checkbox";
import Card from "../../components/cards/Card";
import Form from "../../components/elements/Form";
import axios from "axios";
import { BaseUrl } from "../../components/settings/BaseUrl";
import { authToken } from "../../components/settings/Authentication";
import { useForm } from "react-hook-form";

function AddCustomer(props) {

  //img uploader
  const [pictures, setPictures] = useState([]);
  const [isFormLoading, setIsFormLoading] = useState(false)
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //select box
  const customerType = [
    { value: "Duka", label: "Duka" },
    { value: "Supermaket", label: "Supermarket" },
    { value: "Bar", label: "Bar" },
    { value: "Kiosk", label: "Kiosk" },
  ];

  const statuses = [
    { value: "Open", label: "Open" },
    { value: "Closed Today", label: "Closed Today" },
    { value: "Closed Pemanently", label: "Closed Pemanently" }
  ]


  const onDrop = (picture) => {
    setPictures([...pictures, picture]);
  };

  
  const AddCustomer = (data) => {
    // setIsFormLoading(true);
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
        console.log(response.data)
        // setIsFormLoading(false);
        // navigate("/teams");
      })
      .catch((error) => {
        // setIsFormLoading(false);
        // if (error.response.data.errors) toast(error.response.data.errors);
        // setServerError(error.response.data.errors);
      });
  };

  return (
    <>
      <div className="page main-page-container add-page-container">
        <Card>
          <div
            className="back-btn-wrapper action-btns"
            onClick={() => navigate("/customers")}
          >
            <FaArrowLeft />
          </div>
          <Form
          isFormLoading={isFormLoading}
          header={"Add a team"}
          submitBtnTxt={"Add Team"}
          // submitForm={handleSubmit((data) => AddTeam(data))}
        >
          <div className="form-layouts form-layout-left">
          <input
              {...register("name", { required: true })}
              placeholder={"Outlet name"}
              className="form-input"
            />
            {errors.name && <p>Team name is required.</p>}

            <input
              {...register("phone", { required: true })}
              placeholder={"Phone Number"}
              className="form-input"
            />
            {errors.name && <p>Team name is required.</p>}

            <input
              {...register("device_time", { required: true })}
              placeholder={"Phone Number"}
              className="form-input"
            />
            {errors.name && <p>Team name is required.</p>}

            <select
              {...register("campaign_id", { required: true })}
              className="form-input"
            >
              {/* <option value={""}>Select Campaign</option>
              {businessCampaigns.campaigns && businessCampaigns.campaigns.map((campaign, index)=>{
                 return <option key={index} value={campaign.id}>{campaign.name}</option>
              })} */}
            </select>
            {errors.campaign_id && <p>Select Campaign.</p>}

            <select
              {...register("region_id", { required: true })}
              className="form-input"
            >
              <option value={""}>Select Region</option>
              {/* {regions && regions.map((region, index)=>{
                 return <option key={index} value={region.id}>{region.label}</option>
              })} */}
            </select>
            {errors.region_id && <p>Select Region.</p>}

          </div>
          <div className="form-layouts form-layout-right">
          </div>
        </Form>
          <Form header={"Add a New Customer"} submitForm={AddCustomer} submitBtnTxt={"Add Customer"}>
            <div className="form-layouts form-layout-left">
              <Field type={"text"} placeholder={"Name"} />
              <Field type={"text"} placeholder={"Outlet Name"} />
              <div style={{ marginTop: 15 }}>
                <Select options={customerType} placeholder={"Select customer type..."}/><br/>
                <Select options={statuses} placeholder={"Select customer status..."} />
                <ImageUploader 
                  {...props}
                  withPreview={true}
                  withIcon={true}
                  onChange={onDrop}
                  imgExtension={[".jpg", ".jpeg", ".png"]}
                  maxFileSize={5242880}
                  singleImage={true}
                />
              </div>
            </div>

            <div className="form-layouts form-layout-right">
              <Field type={"text"} placeholder={"Phone"} />
              <Field type={"text"} placeholder={"Address"} />
              <br/>
              <p style={{display:"flex", alignItems:"center", color:"#666", fontSize:14}}>
                <Checkbox />
                <span> Uncheck to remove customer from listing</span>
              </p>
            </div>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default AddCustomer;
