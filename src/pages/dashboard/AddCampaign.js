import React, { useContext, useEffect, useState } from "react";
import Card from "../../components/cards/Card";
import Field from "../../components/elements/Field";
import Form from "../../components/elements/Form";
import ImageUploader from "react-images-upload";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import{ useDropzone } from "react-dropzone";
import axios from "axios";
import { BaseUrl } from "../../components/settings/BaseUrl";
import { authToken } from "../../components/settings/Authentication";
import { authUserBusinessData } from "../../components/settings/AuthUserData";
import { UserContext } from "../../components/context/UserContext";


function AddCampaign(props) {
  const { setIsCampaignAdded } = useContext(UserContext);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [campaignTypes, setCampaignTypes] = useState([])
  const navigate = useNavigate();
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

  useEffect(()=>{
    getCampaignTypes()
  },[])

  const getCampaignTypes = () =>{
    axios({
      url: BaseUrl("campaign-types"),
      method: "get",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setCampaignTypes(response.data)
      })
      .catch((err) => {});
  }

  const addCampaign = (data) =>{
    setIsFormLoading(true);
    axios({
      url: BaseUrl("campaign"),
      method: "post",
      data:{name: data.name, campaign_type_id: data.campaign_type_id, business_id:authUserBusinessData().business_id},
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setIsCampaignAdded(true)
        setIsFormLoading(false);
        navigate('/dashboard')

      })
      .catch((err) => {
        setIsFormLoading(false);
      });
  }
  

  return (
    <div className="page main-page-container ">
      <Card>
        <div
          className="back-btn-wrapper action-btns"
          onClick={() => navigate("/dashboard")}
        >
          <FaArrowLeft />
        </div>
        <Form   
            isFormLoading={isFormLoading}
            header={"Add a Campaign"}
            submitBtnTxt={"Add Campaign"}
            submitForm={handleSubmit((data) => addCampaign(data))}>
          <div className="form-layouts form-layout-left">
          <input
                type="text"
                {...register("name", { required: true })}
                placeholder={"Campaign Name"}
                className="form-input"
              />
              {errors.name && <p>Campaign name is required.</p>}
              <select
                {...register("campaign_type_id", { required: true })}
                className="form-input"
              >
                <option value={""}>Select Campaign Type</option>
                {campaignTypes &&
                  campaignTypes.map((campaignType, index) => {
                    return (
                      <option key={index} value={campaignType.id}>
                        {campaignType.name}
                      </option>
                    );
                  })}
              </select>
              {errors.campaign_type_id && <p>Select Campaign type.</p>}
            <div style={{ marginTop: 15 }}>
            {/* <section className="container" style={{paddingLeft:0,marginTop:6}}>
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
                <aside style={thumbsContainer}>{thumbs}</aside>
              </section> */}
            </div>
          </div>
          <div className="form-layouts form-layout-right">
            <br />
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default AddCampaign;
