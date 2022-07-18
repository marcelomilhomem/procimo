import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";

const Div = styled.div`
  height: 80vh;
  width: 80vw;
`;

function MapPage() {
  const [networks, setNetworks] = useState([]);

  const fetchApi = () => {
    axios
      .get(`http://api.citybik.es/v2/networks`)
      .then((response) => {
        setNetworks(response.data.networks);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.REACT_APP_API_KEY}`,
  });

  return (
    <Div>
      {isLoaded ? (
        <GoogleMap
          id="map"
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={{ lat: 38.72726949547492, lng: -9.139262879074261 }}
          zoom={10}
        >
          {networks.map((position) => {
            return (
              <Marker
                position={{
                  lat: position.location.latitude,
                  lng: position.location.longitude,
                }}
              />
            );
          })}
        </GoogleMap>
      ) : (
        <></>
      )}
    </Div>
  );
}

export default MapPage;
