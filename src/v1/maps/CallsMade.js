import React, { useContext, useEffect, useState } from "react";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import Map from "../../components/maps/Map";
import { fetchUserVisits, fetchUsersByRegions } from "../../components/api/Users";
import { AuthContext } from "../../context/authContext";
import { fetchRegionData } from "../../components/api/Regions";
import PageLoader from "../../components/common/PageLoader";
import { fetchSales, fetchSalesMarkers } from "../../components/api/Sales";
import { BaseUrl } from "../../components/settings/BaseUrl";
import axios from "axios";
import { fetchVisitMarkers } from "../../components/api/Visits";

const containerStyle = {
  width: "100%",
  height: "550px",
};

const cities = [
  { name: "Arusha", lat: -3.386925, lng: 36.682839 },
  { name: "Dar es Salaam", lat: -6.792354, lng: 39.208328 },
  { name: "Dodoma", lat: -6.162959, lng: 35.751607 },
  { name: "Mwanza", lat: -2.516667, lng: 32.900002 },
  { name: "Zanzibar City", lat: -6.165222, lng: 39.195912 },
  { name: "Mbeya", lat: -8.901383, lng: 33.463651 },
  { name: "Morogoro", lat: -6.82102, lng: 37.661539 },
  { name: "Tanga", lat: -5.070823, lng: 39.09883 },
  { name: "Kigoma", lat: -4.876918, lng: 29.62617 },
  { name: "Moshi", lat: -3.35, lng: 37.333333 },
  { name: "Tabora", lat: -5.028004, lng: 32.826111 },
  { name: "Songea", lat: -10.682932, lng: 35.654973 },
  { name: "Musoma", lat: -1.5, lng: 33.8 },
  { name: "Iringa", lat: -7.773522, lng: 35.691539 },
  { name: "Ruvuma", lat: -10.684629, lng: 35.650772 },
  { name: "Shinyanga", lat: -3.664336, lng: 33.421577 },
  { name: "Singida", lat: -4.816667, lng: 34.75 },
  { name: "Geita", lat: -2.868278, lng: 32.173889 },
  { name: "Kagera", lat: -1.878446, lng: 31.067864 },
  { name: "Katavi", lat: -6.935284, lng: 31.269984 },
  { name: "Manyara", lat: -4.329928, lng: 35.743929 },
  { name: "Njombe", lat: -9.329966, lng: 34.77027 },
  { name: "Pwani", lat: -6.83568, lng: 39.363197 },
  { name: "Rukwa", lat: -7.006273, lng: 31.536862 },
  { name: "Simiyu", lat: -2.621916, lng: 34.743425 },
  { name: "Zanzibar West", lat: -6.162751, lng: 39.187616 },
  { name: "Zanzibar North", lat: -5.726292, lng: 39.293977 },
  { name: "Zanzibar Central/South", lat: -6.213167, lng: 39.343667 },
  { name: "Mtwara", lat: -10.267, lng: 40.183 },
  { name: "Lindi", lat: -10.0, lng: 39.716667 },
  { name: "Kaskazini Pemba", lat: -4.892222, lng: 39.661389 },
  { name: "Kusini Pemba", lat: -5.331944, lng: 39.724167 },
  { name: "Kaskazini Unguja", lat: -5.984444, lng: 39.245 },
  { name: "Kusini Unguja", lat: -6.286667, lng: 39.514167 },
];
// const markers = [
//   {
//     id: 1,
//     lngLat: [39.2833, -6.7924],
//     title: "D",
//   },
//   {
//     id: 2,
//     lngLat: [39.219, -6.7924],
//     title: "S",
//   },
//   {
//     id: 3,
//     lngLat: [39.2825, -6.7927],
//     title: "M",
//   },
//   {
//     id: 4,
//     lngLat: [39.288, -6.7942],
//     title: "K",
//   },
//   {
//     id: 5,
//     lngLat: [39.2852, -6.7906],
//     title: "B",
//   },
//   {
//     id: 6,
//     lngLat: [39.2198, -6.7891],
//     title: "R",
//   },
//   {
//     id: 7,
//     lngLat: [39.2875, -6.793],
//     title: "H",
//   },
//   // Add more markers as needed
// ];

function CallsMade() {
  const [showAgentList, setShowAgentList] = useState(false);
  const [zoom, setZoom] = useState(6);
  const [users, setUsers] = useState([]);
  const [regions, setRegions] = useState([]);
  const [isRegionLoading, setIsRegionLoading] = useState(false);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isMarkersLoading, setIsMarkersLoading] = useState(false);
  const [sales, setSales] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState({
    lat: -6.804125,
    lng: 35.642322,
  });

  const BASE_URL = BaseUrl("/");
  const token = localStorage.getItem("token");
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    setIsRegionLoading(true);
    const fetchRegions = async () => {
      const response = await fetchRegionData(axiosInstance);
      if (response) {
      
        setIsRegionLoading(false);
        setRegions(response);
      }
    };

    fetchRegions();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const salesData = await fetchSales(axiosInstance, loggedUser.business_id);
  //     if (salesData) {
  //       console.log(salesData);
  //       setSales(salesData);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    //query all visits markers
    fetchOverallMarkers(0);
    setCenter({
      lat: -6.804125,
      lng: 35.642322,
    });
  }, []);

  const fetchOverallMarkers = async (userId) => {

    setIsMarkersLoading(true)

    const response = await fetchVisitMarkers(
      axiosInstance,
      loggedUser.business_id,
      userId
    );

    if (response) {
      setIsMarkersLoading(false)
      setMarkers(response);
      
    }

  };

  const onRegionChange = (item) => {
    setCenter(item);
    setShowAgentList(true);
    setZoom(10);

    getUserVisits(item);
  };

  const showAllCities = () => {
    setShowAgentList(false);
    setCenter({ lat: -8.589849, lng: 34.397487 });
    setZoom(5);
  };

  const getUserVisits = async (region) => {
    //fetch users visits by region id and business id
    setIsUsersLoading(true);

    const response = await fetchUserVisits(axiosInstance, loggedUser.business_id, region.id);
    if (response) {
      setIsUsersLoading(false);
      setUsers(response);
    }
  };

  const onAgentClicked = (item) =>{
    setMarkers([])
    fetchOverallMarkers(item.user_id)

    if(markers.length === 0 ) return;
    setCenter(markers[0].lngLat)

  }

  return (
    <div>
      <div className="menu-bar">
        <h1 className="page-header">/ Map</h1>
        <div>
          <ul className="view-list">
            <li className="active">Visitations</li>
            {/* <li>Locations</li> */}
          </ul>
        </div>
      </div>
      <div className="main-dashboard-wrapper">
        <div className="inner-card-wrapper-2">
          <div
            className="lg-card"
            style={{ height: 570, flex: 5, padding: 10,position:"relative" }}
          >
            {isMarkersLoading && <PageLoader />}
           {!isMarkersLoading &&  <Map markers={markers} zoom={zoom} center={center} />}
          </div>
          <div className="md-card" style={{ height: 550, flex: 1.4, overflowY:"scroll" }}>
            {!showAgentList && (
              <div
                className="city-list-container"
                style={{ position: "relative" }}
              >
                <h1 style={{ fontWeight: "bold", fontSize: 14 }}>
                  Regions in Tanzania
                </h1>
                {isRegionLoading && <PageLoader />}

                {!isRegionLoading && (
                  <ul className="city-list">
                    {regions.map((city, index) => (
                      <li
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => onRegionChange(city)}
                      >
                        <span className="city-icon">
                          <FaMapMarkerAlt />{" "}
                        </span>
                        {city.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {showAgentList && (
              <div style={{ position: "relative", padding: 10 }}>
                <p
                  onClick={showAllCities}
                  style={{
                    cursor: "pointer",
                    fontWeight: 100,
                    fontSize: 18,
                    fontWeight: 800,
                  }}
                >
                  Back to cities
                </p>
                {users.length === 0 && <p>No data</p>}
                {isUsersLoading && (
                  <div style={{ paddingTop: 200 }}>
                    {" "}
                    <PageLoader />{" "}
                  </div>
                )}

                {!isUsersLoading && users.length > 0 && (
                  <ul className="city-list">
                    {users &&
                      users.map((user, index) => {
                        return (
                          <li
                            key={index}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              cursor: "pointer",
                              paddingLeft: 10,
                              paddingRight: 10,
                            }}
                            onClick={() => onAgentClicked(user)}
                          >
                            <div>{user.user_name}</div>
                            {/* <div>{user.num_visits}</div> */}
                          </li>
                        );
                      })}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CallsMade;
