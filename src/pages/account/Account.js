import React, { useState, useEffect } from "react";
import { BsGear, BsLock, BsPerson } from "react-icons/bs";
import Card from "../../components/cards/Card";
import Avatar from "../../components/common/Avatar";
import { Checkbox } from "../../components/elements/Checkbox";
import Field from "../../components/elements/Field";
import Form from "../../components/elements/Form";
import ImageUploader from "react-images-upload";
import VertList from "../../components/common/VertList";
import { useNavigate } from "react-router-dom";
import { authUserData } from "../../components/settings/AuthUserData";

function Account(props) {
  const navigate = useNavigate();

  //img uploader
  const [pictures, setPictures] = useState([]);
  const [imgPreview, setImgPreview] = useState("");
  
  const [user, setUser] = useState({});

  useEffect(()=>{
     setUser(authUserData())
  },[])

  const onDrop = (picture) => {
    console.log(pictures);
    setPictures([...pictures, picture]);
  };


  return (
    <div >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <Card>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>
              <Avatar width={80} height={80} avatarImgPreview={imgPreview} />
              <h4 style={{ marginTop: 5 }}>{user.name}</h4>
            </div>
            <ImageUploader
              {...props}
              withPreview={false}
              withIcon={false}
              onChange={onDrop}
              imgExtension={[".jpg", ".jpeg", ".png"]}
              maxFileSize={5242880}
              singleImage={true}
              withLabel={false}
            />
          </div>
        </Card>

        <Card>
          <Form header={"My Account"} submitBtnTxt={"Save Changes"}>
            <div className="form-layouts form-layout-left">
              <Field type={"text"} placeholder={user.name} />
              <Field type={"text"} placeholder={user.email} />
            </div>
            <div className="form-layouts form-layout-right">
              <Field type={"text"} placeholder={user.name} />
              <Field type={"text"} placeholder={user.phone} />
              <br />
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default Account;
