import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";


const Map = ({ markers, center, zoom }) => {
  const [map, setMap] = useState(null);

  const mapContainer = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoicGV0ZXJraGFtaXMiLCJhIjoiY2xiODZudGx3MGkwdjNxcDRsMzZoOXVndiJ9.3ydB-mlu_Pc_06cyWyr6nA";
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: center,
      zoom: zoom
    });

    // setMap(map)
    addZoomOnClick(map);
    addControls(map);
    addMarkers(map);

    return () => map.remove();
  }, [center]);


//   useEffect(() => {
//     if (map) {
//       // Clear existing markers
//       markers.forEach((marker) => marker.remove());

//       // Add markers to the map
//       markers.forEach((marker) => {
//         const el = document.createElement("div");
//         el.className = "marker";

//         const newMarker = new mapboxgl.Marker(el)
//           .setLngLat([marker.lng, marker.lat])
//           .addTo(map);

//         markers.push(newMarker);
//       });
//     }
//   }, [map]);

  const refreshMap = () => {
    if (map) {
      // Clear existing markers
      markers.forEach((marker) => marker.remove());

      // Add new markers to the map
      markers.forEach((marker) => {
        const el = document.createElement("div");
        el.className = "marker";

        const newMarker = new mapboxgl.Marker(el)
          .setLngLat([marker.lng, marker.lat])
          .addTo(map);

        markers.push(newMarker);
      });
    }
  };

  const addMarkers = (map) => {
    markers.forEach((marker) => {
        // console.log(marker);
      const el = document.createElement("div");
      el.className = "marker";
      el.textContent = marker.title?.substr(0,1);

      switch (marker.id % 7) {
        case 1:
          el.style.backgroundColor = "red";
          break;
        case 2:
          el.style.backgroundColor = "blue";
          break;
        case 3:
          el.style.backgroundColor = "#f60";
          break;
        case 4:
          el.style.backgroundColor = "grey";
          break;
        case 5:
          el.style.backgroundColor = "orange";
          break;
        case 6:
          el.style.backgroundColor = "purple";
          break;
        case 0:
          el.style.backgroundColor = "#576cd3";
          break;
        default:
          el.style.backgroundColor = "#000";
      }

      // ["#61c3fe", "#f60","#576cd3","#9c27b0","#ccc"]
      new mapboxgl.Marker(el).setLngLat(marker.lngLat).addTo(map);
    });
  };

  const addControls = (map) => {
    // Add zoom control
    const zoomControl = new mapboxgl.NavigationControl();
    map.addControl(zoomControl, "top-right");

    // Add full screen control
    // const fullscreenControl = new MapboxFullscreen();
    // map.addControl(fullscreenControl, "top-right");

    // // Add geocoder control (optional)
    // const geocoderControl = new MapboxGeocoder({
    //   accessToken: mapboxgl.accessToken,
    //   mapboxgl: mapboxgl,
    //  });
  };

  const addZoomOnClick = (map) => {
    map.on("click", (event) => {
      // Check if the click event occurred on the map container
      if (event.originalEvent.target.classList.contains("mapboxgl-canvas")) {
        const zoom = map.getZoom();
        const { offsetX, offsetY } = event;
        const center = map.unproject([offsetX, offsetY]);
        const newZoom = event.originalEvent.shiftKey ? zoom - 1 : zoom + 1;

        map.flyTo({
          center,
          zoom: newZoom,
        });
      }
    });
  };

  return <div ref={mapContainer} style={{ height: "550px", width: "100%" }} />;
};

export default Map;
