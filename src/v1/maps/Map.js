import React, { useEffect, useState } from "react";
import { fetchRegionData } from "../../components/api/Regions";
import { BaseUrl } from "../../components/settings/BaseUrl";
import axios from "axios";
import { FaFilter, FaMapMarkerAlt } from "react-icons/fa";
import { fetchLocations, fetchVisitMarkers } from "../../components/api/Visits";
import PageLoader from "../../components/common/PageLoader";
import MapComponent from "../../components/maps/Map";
import "./Map.css";
import { fetchProducts } from "../../components/api/Products";
import { fetchCustomerTypes } from "../../components/api/Customers";
function Map() {
  const BASE_URL = BaseUrl("/");
  const token = localStorage.getItem("token");
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState({});
  const [isMarkersLoading, setIsMarkersLoading] = useState(false);
  const [mapMarkerFilters, setMapMarkerFilters] = useState("types");
  const [products, setProducts] = useState([]);
  const [customerTypes, setCustomerTypes] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [zoom, setZoom] = useState(11);
  const [center, setCenter] = useState({
    lat: -6.757866,
    lng: 39.226333,
  });

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const getBusinessProducts = async () => {
      const response = await fetchProducts(
        axiosInstance,
        loggedUser.business_id
      );
      if (response) {
        setProducts(response);
      }
    };

    getBusinessProducts();
  }, []);
  useEffect(() => {
    const getCustomerTypes = async () => {
      const response = await fetchCustomerTypes(axiosInstance);
      if (response) {
        setCustomerTypes(response);
      }
    };

    getCustomerTypes();
  }, []);

  useEffect(() => {
    // setIsRegionLoading(true);
    const fetchRegions = async () => {
      const response = await fetchRegionData(axiosInstance);
      if (response) {
        setRegions(response);
        setSelectedRegion(response[1]);
      }
    };

    fetchRegions();
  }, []);

  useEffect(() => {
    //query all visits markers
    fetchOverallMarkers();
    // setCenter({
    //   lat: -6.757866,
    //   lng: 39.226333,
    // });
  }, [mapMarkerFilters]);

  const fetchOverallMarkers = async () => {
    setIsMarkersLoading(true);

    const response = await fetchLocations(
      axiosInstance,
      loggedUser.business_id,
      mapMarkerFilters
    );

    if (response) {
      console.log(response);
      setIsMarkersLoading(false);
      setMarkers(response);
    }
  };

  const onRegionChange = (region) => {
    setSelectedRegion(region);
    setCenter(region);
    setZoom(11);
  };

  const filterMarkers = (filter) => {
    setMapMarkerFilters(filter);
    // fetchOverallMarkers()
  };

  return (
    <div className="main-dashboard-wrapper map-main-wrapper">
      <div className="inner-card-wrapper-4" style={{ gap: 0 }}>
        <div
          className="sm-card"
          style={{ flex: 0.4, height: 700, overflowY: "scroll" }}
        >
          <ul className="city-list" style={{ gap: 0, marginTop: 0 }}>
            {regions.map((region, index) => (
              <li
                className={
                  selectedRegion.id === region.id
                    ? "region-list active-with-bg"
                    : "region-list"
                }
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => onRegionChange(region)}
              >
                <span className="city-icon">
                  <FaMapMarkerAlt />{" "}
                </span>
                {region.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="md-card" style={{ height: 700 }}>
          <div>
            <div className="map-filter-wrapper">
              <ul className="map-filters">
                <FaFilter /> Sales by:
                <li
                  className={mapMarkerFilters == "types" && "active"}
                  onClick={() => filterMarkers("types")}
                >
                  Customer types
                </li>
                <li
                  className={mapMarkerFilters == "products" ? "active" : ""}
                  onClick={() => filterMarkers("products")}
                >
                  Products
                </li>
              </ul>
            </div>
            {mapMarkerFilters === "types" && (
              <div className="map-filter-items">
                <ul>
                  {customerTypes.map((item, index) => {
                    return (
                      <li key={index}>
                        <div
                          style={{
                            backgroundColor: item.color,
                            color: "white",
                            borderRadius: "100%",
                            height: 16,
                            width: 16,
                            fontSize: 10,
                            justifyContent: "center",
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          {item.name.substr(0,1)}
                        </div>
                        <span>{item.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {mapMarkerFilters === "products" && (
              <div className="map-filter-items">
                <ul>
                  {products?.map((item, index) => {
                    return (
                      <li key={index}>
                        <div
                          style={{
                            backgroundColor: item.color,
                            color: "white",
                            borderRadius: "100%",
                            height: 16,
                            width: 16,
                            fontSize: 10,
                            justifyContent: "center",
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          {item.name.substr(0, 1)}
                        </div>
                        <span>{item.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {isMarkersLoading && <PageLoader />}
            {!isMarkersLoading && (
              <MapComponent markers={markers} zoom={zoom} center={center} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Map;
