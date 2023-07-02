import React, { useEffect, useRef, useState, useContext } from "react";
import mapboxgl from "mapbox-gl";
import ReactDOM from "react-dom";
import axios from "axios";
import { BaseUrl } from "../../components/settings/BaseUrl";
import { authToken } from "../../components/settings/Authentication";
import "../customers/Map.css";
import { UserContext } from "../../components/context/UserContext";
import Card from "../../components/cards/Card";
import { FaArrowLeft } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";
import VertList from "../../components/common/VertList";
import Loader from "../../components/pageloader/Loader";
import Header from "../../components/header/Header";
import ActionButtonsMenue from "../../components/header/ActionButtonsMenue";
import Select from "react-select";

//TODO:store this inside env file
mapboxgl.accessToken =
  "pk.eyJ1IjoicGV0ZXJraGFtaXMiLCJhIjoiY2xiODZudGx3MGkwdjNxcDRsMzZoOXVndiJ9.3ydB-mlu_Pc_06cyWyr6nA";

const Marker = ({ onClick, children, feature, markerClass }) => {
  const _onClick = () => {
    onClick(feature.properties.title);
  };

  return (
    <button onClick={_onClick} className={"marker " + markerClass}>
      {children}
    </button>
  );
};

function VisitedLocations(props) {
  const {campaignId } = useContext(UserContext);
  const [geoJson, setGeoLocations] = useState();
  const [selectUserId, setSelectUserId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState({});
  const [agents, setAgents] = useState();
  const mapContainerRef = useRef(null);

  const navigate = useNavigate(Navigate);
  
  useEffect(() => {
    getRegions();
    setSelectUserId(1);
  }, [campaignId]);

  useEffect(() => {
   
    if(!selectedRegion.lng)
    return;

    //init map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [selectedRegion.lng, selectedRegion.lat],
      zoom: 10,
    });

    // Render custom marker components
    if (geoJson)
      geoJson.customer_visited_locations.features.forEach((feature) => {
        //console.log(feature)
        // Create a React ref
        const ref = React.createRef();
        // Create a new DOM node and save it to the React ref
        ref.current = document.createElement("div");

        // Render a Marker Component on our new DOM node
        ReactDOM.render(
          <Marker
            onClick={markerClicked}
            feature={feature}
            markerClass={feature.properties.customer_type}
          />,
          ref.current
        );

        // Create a Mapbox Marker at our new DOM node
        new mapboxgl.Marker(ref.current)
          .setLngLat(feature.geometry.coordinates)
          .addTo(map);
      });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Clean up on unmount
    return () => map.remove();
  }, [geoJson, campaignId, regions.length > 0, selectedRegion]);

  useEffect(()=>{
    getAgentsBylocation(selectedRegion.id, campaignId)
  },[selectedRegion.id,campaignId])

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


  const getAgentsBylocation = (regionId,campaignId) => {
    console.log(regionId, campaignId);
    axios({
      url: BaseUrl("agents/campaign/"+campaignId+"/region/" + regionId),
      method: "get",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setAgents(response.data)
        getLocations(response.data[0].id)
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const getLocations = (userId) => {
    setSelectUserId(userId);
    setIsLoading(true);
    axios({
      url: BaseUrl("locations/campaign/" + campaignId + "/user/" + userId),
      method: "get",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setGeoLocations(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // Initialize map when component mounts

  const markerClicked = (title) => {
    window.alert(title);
  };

  const viewCustomerLocations = (userId) => {
    getLocations(userId);
  };

  //handle region change
  const handleRegionChange = (e) => {
    setSelectedRegion(e);
  };

  return (
    <div>
      <div
        style={{
          width: 300,
          height: "100%",
          background: "white",
          position: "fixed",
          top: 68,
          bottom: 0,
          left: 260,
          zIndex: 9999,
          padding: 10,
        }}
      >
        <div
          className="back-btn-wrapper action-btns"
          onClick={() => navigate("/dashboard")}
        >
          <FaArrowLeft />
        </div>
        <Card height={"100%"} cardHeader="Agents locations">
          <Select
            options={regions}
            placeholder={"Filter by region..."}
            onChange={handleRegionChange}
          />
          <br />
          <ul style={{ display: "flex", gap: 10, flexDirection: "column" }}>
            {agents
              ? agents.map((user, index) => {
                  return (
                    <VertList
                      key={index}
                      background={user.id == selectUserId ? "#ecf4fc" : null}
                      color={"#144b81"}
                      radius={7}
                      onClick={() => viewCustomerLocations(user.id)}
                    >
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <span>{user.name}</span> <span>{user.num_visit}</span>
                      </p>
                    </VertList>
                  );
                })
              : <p>No data available</p>}
          </ul>
        </Card>
      </div>
      {/* {isLoading ? <Loader loadMsg={"loading map..."} /> : null} */}
      <div className="location-float-hdr" style={{ width: "64%", right: 0 }}>
        <Header>
          <ActionButtonsMenue>
            <div className="customer-type">
              <ul>
                <li>
                  <strong>Types:</strong>
                </li>
                <li style={{}} className="cust-type-wrapper">
                  <span className="legend supermarket"></span>Supermaket
                </li>
                <li className="cust-type-wrapper">
                  <span className="legend bar"></span>Bar
                </li>
                <li className="cust-type-wrapper">
                  <span className="legend duka"></span>Duka
                </li>
                <li className="cust-type-wrapper">
                  <span className="legend mini-supermarket"></span>Mini
                  Supermaket
                </li>
                <li className="cust-type-wrapper">
                  <span className="legend restaurant"></span>Restaurant
                </li>
                <li className="cust-type-wrapper">
                  <span className="legend pub"></span>Pub
                </li>
              </ul>
            </div>
          </ActionButtonsMenue>
        </Header>
      </div>
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
}

export default VisitedLocations;
