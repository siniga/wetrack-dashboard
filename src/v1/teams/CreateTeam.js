import React, { useEffect, useRef, useState } from "react";
import Loader from "../../../src/img/spinner_loader.gif";
import { fetchRegionData } from "../../components/api/Regions";
import { addTeamData } from "../../components/api/Teams";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../../components/settings/BaseUrl";
import axios from "axios";

function CreateTeam() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [formData, setFormData] = useState({ name: "", region_id: "" });
  const [isPwdLoading, setIsPwdLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [regionError, setRegionError] = useState("");

  const nameRef = useRef(null);
  const regionRef = useRef(null);

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
    const fetchData = async () => {
      const regionData = await fetchRegionData(axiosInstance);
      if (regionData) {
        setRegions(regionData);
        setRegions((prevRegionData) => [
          { id: "", name: "Select Region" },
          ...prevRegionData,
        ]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      business_id: loggedUser?.business_id,
    }));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onCreateSubmit = async (e) => {
    e.preventDefault();

    if (formData.name.trim() === "") {
      setNameError("Team name is required");
      return;
    } else {
      setNameError("");
      regionRef.current.focus();
    }

    if (formData.region_id.trim() === "") {
      setRegionError("Select Region");
      return;
    } else {
      setRegionError("");
    }

    setIsLoading(true);
    
    const response = await addTeamData(axiosInstance,formData);
    if (response) {
      setIsLoading(false);
      navigate("/teams")
    }
  };

  return (
    <div>
      <div className="menu-bar">
        <h1 className="page-header">/ Create Team</h1>
        <div></div>
      </div>
      <div className="page-wrapper">
        <div className="form-container">
          <h1 style={{ fontSize: 22 }}>New Team</h1>
          <h3>Team Details</h3>
          <form onSubmit={onCreateSubmit}>
            <div className="form-contols-container">
              <div className="input-section">
                <label htmlFor="name">
                  Name:
                  <input
                    placeholder="Enter team name"
                    ref={nameRef}
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    // className={nameError ? "invalid" : ""}
                  />
                  {nameError && (
                    <p className="error error-right">{nameError}</p>
                  )}
                </label>
                <label>
                  Region:
                  <select
                    ref={regionRef}
                    name="region_id"
                    value={formData.region}
                    onChange={handleChange}
                    // className={roleError ? "invalid" : ""}
                  >
                    {regions.length > 0 &&
                      regions?.map((region, index) => (
                        <option key={index} value={region.id}>
                          {region ? region.name : "Select Region"}
                        </option>
                      ))}
                  </select>
                  {regionError && (
                    <p className="error error-right">{regionError}</p>
                  )}
                </label>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" className="primary-btn">
                {isLoading && <img src={Loader} width={30} />}
                {!isLoading && <p>Save</p>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTeam;
