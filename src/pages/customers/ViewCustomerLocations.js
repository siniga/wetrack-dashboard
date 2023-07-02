import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import ActionButtonsMenue from "../../components/header/ActionButtonsMenue";
import Header from "../../components/header/Header";
// import geoJson from "./dar.json";
import "./Map.css";
import "./Customers.css";
import axios from "axios";
import { BaseUrl } from "../../components/settings/BaseUrl";
import { authToken } from "../../components/settings/Authentication";

//TODO:store this inside env file
mapboxgl.accessToken =
  "pk.eyJ1IjoicGV0ZXJraGFtaXMiLCJhIjoiY2xiODZudGx3MGkwdjNxcDRsMzZoOXVndiJ9.3ydB-mlu_Pc_06cyWyr6nA";

const Marker = ({ onClick, children, feature, markerClass }) => {
  const _onClick = () => {
    onClick(feature.properties.title);
  };

  return (
    <button onClick={_onClick} className={"marker "+markerClass}>
      {children}
    </button>
  );
};

function ViewCustomerLocations(props) {
  const [geoJson, setGeoLocations] = useState();
  const mapContainerRef = useRef(null);

  useEffect(() => {
    getCustomerLocations();
  }, []);

  const getCustomerLocations = () => {
    axios({
      url: BaseUrl("customer/locations/bussiness/2"),
      method: "get",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json"
      },
    })
      .then((response) => {
        console.log(response.data);
        // console.log(geoJson)
        setGeoLocations(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [39.221171, -6.799207],
      zoom: 10,
    });

    // Render custom marker components
    if(geoJson)
    geoJson.features.forEach((feature) => {
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
  }, [geoJson]);

  const markerClicked = (title) => {
    window.alert(title);
  };

  return (
    <div className="location-main-wrapper">
      {" "}
      <div className="location-float-hdr">
        <Header>
          <ActionButtonsMenue>
            <div className="customer-type">
              <ul>
                <li>
                  <strong>Types:</strong>
                </li>
                <li style={{}} className="cust-type-wrapper"><span className="legend supermarket"></span>Supermaket</li>
                <li className="cust-type-wrapper"><span className="legend bar"></span>Bar</li>
                <li className="cust-type-wrapper"><span className="legend duka"></span>Duka</li>
                <li className="cust-type-wrapper"><span className="legend mini-supermarket"></span>Mini Supermaket</li>
                <li className="cust-type-wrapper"><span className="legend restaurant"></span>Restaurant</li>
                <li className="cust-type-wrapper"><span className="legend pub"></span>Pub</li>
              </ul>
            </div>
          </ActionButtonsMenue>
        </Header>
      </div>
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
}

export default ViewCustomerLocations;
