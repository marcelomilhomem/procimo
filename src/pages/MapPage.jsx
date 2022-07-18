import React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import styled from "styled-components";

const Div = styled.div`
  height: 80vh;
  width: 80vw;
`;

function MapPage() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.REACT_APP_API_KEY}`,
  });
  return (
    
    <Div>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={{ lat: 38.72726949547492, lng: -9.139262879074261 }}
          zoom={10}
        ></GoogleMap>
      ) : (
        <></>
      )}
    </Div>
  );
}

export default MapPage;
