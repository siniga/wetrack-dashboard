import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Form from "../../components/elements/Form";
import { AddData } from "../../components/settings/api/AddData";
import { FetchData } from "../../components/settings/api/FetchData";

function BusinessRegitrationForm(props) {
  const { member,credentials,setCredentials,setIsUserDataAvailable,getUserBusiness, setIsLoading } = props;
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [businessTypes, setBusinessTypes] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    FetchData("business-types")
      .then((response) => {
        setBusinessTypes(response);
      })
      .catch((err) => {});
  }, []);

  useEffect(()=>{
    //check if business is registered before submitting data
    if(credentials.business_name)
    registerBusiness();

  },[credentials])

  

  const registerMember = (data) =>{
    const {name, email, password} = member;
    const {business_name, business_type_id,phone} = data;
    setCredentials({...credentials,name:name,email:email,password:password,business_name:business_name, business_type_id:business_type_id, phone:phone})
   
  }

  const registerBusiness = () => {
    //set new data
    setIsLoading(true)
    setIsUserDataAvailable(false);
     AddData("register",credentials).then(response=>{
        setIsLoading(false)
         localStorage.setItem("auth_token", response.token);
         localStorage.setItem("user", JSON.stringify(response.user));
 
         setIsUserDataAvailable(true);
         getUserBusiness();
       
      }).catch(err =>{
        setIsLoading(false)
      })
   };
  return (
    <>
      <div>
        <h1 className="header">Create Business</h1>
        <p className="sub-header">Lets continue with a free account</p>
        <form onSubmit={handleSubmit((data) => registerMember(data))}>
          <br />
          <label>Business Name:</label>
          <input
            {...register("business_name", { required: true })}
            placeholder={"Business Name"}
            className="form-input"
          />
          {errors.business_name && <p>Business name is required.</p>}
          <br />
          <label>Business Type:</label>
          <select
            {...register("business_type_id", { required: true })}
            className="form-input"
          >
            <option value={""}>Select Business Type</option>
            {businessTypes &&
              businessTypes.map((type, index) => {
                return (
                  <option key={index} value={type.id}>
                    {type.name}
                  </option>
                );
              })}
          </select>
          {errors.business_type_id && <p>Select Business Type.</p>}
          <br />
          <label>Phone:</label>
          <input
            {...register("phone", { required: true })}
            placeholder={"Your phone number"}
            className="form-input"
            type={"number"}
          />
          {errors.phone && <p>phone is required.</p>}
          <input type="submit" value="create account" className="submit-btn" />
        </form>
      </div>
    </>
  );
}

export default BusinessRegitrationForm;
