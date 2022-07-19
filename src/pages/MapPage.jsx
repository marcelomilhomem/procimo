import React from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  MarkerClusterer,
} from "@react-google-maps/api";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";

const Div = styled.div`
  height: 80vh;
  width: 60vw;
`;

function MapPage() {

  const [networks, setNetworks] = useState([]);
  const [clusters, setClusters] = useState(new Map());

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

  //Descrever a função
  const onMapLoaded = () => {
    const oCountries = new Map();
    let aCoordinates;
    networks.forEach((oNetwork) => {
      aCoordinates = oCountries.get(oNetwork.location.country);
      if (!aCoordinates) {
        oCountries.set(oNetwork.location.country, [oNetwork.location]);
      } else {
        aCoordinates.push(oNetwork.location);
        oCountries.set(oNetwork.location.country, aCoordinates);
      }
    });

    setClusters(oCountries);
  };

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
          onLoad={onMapLoaded}
        >
          {Array.from(clusters.values()).map((entry) => {
            debugger;
            return (
              <MarkerClusterer>
                {(clusterer) =>
                  entry.map((location) => (
                    <Marker
                      clusterer={clusterer}
                      position={{
                        lat: location.latitude,
                        lng: location.longitude,
                      }}
                    />
                  ))
                }
              </MarkerClusterer>
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
