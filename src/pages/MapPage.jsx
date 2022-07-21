import React from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  MarkerClusterer,
} from "@react-google-maps/api";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Api from "../service/api.js";

const Div = styled.div`
  height: 100vh;
  width: 70vw;
`;

function MapPage() {
  const [networks, setNetworks] = useState([]);
  const [clusters, setClusters] = useState(new Map());

  const [networkStations, setNetworkStations] = useState([]);

  const fetchApi = () => {
    Api.gNetworks()
      .then((response) => {
        setNetworks(response.data.networks);
      })
      .catch((err) => alert(err));
  };

  const handleOnClick = async (id) => {
    try {
      let response = await Api.gStations(id);
      setNetworkStations(response.data.network.stations);
      console.log(response.data.network.stations);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const onMapLoaded = () => {
    const oCountries = new Map();
    let aNetworks;
    networks.forEach((oNetwork) => {
      aNetworks = oCountries.get(oNetwork.location.country);
      if (!aNetworks) {
        oCountries.set(oNetwork.location.country, [oNetwork]);
      } else {
        aNetworks.push(oNetwork);
        oCountries.set(oNetwork.location.country, aNetworks);
      }
    });

    setClusters(oCountries);
    console.log(oCountries);
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
          {Array.from(clusters.values()).map((oEntry) => {
            return (
              <MarkerClusterer>
                {(clusterer) =>
                  oEntry.map((oNetwork) => (
                    <Marker
                      onClick={() => {
                        handleOnClick(oNetwork.id);
                      }}
                      clusterer={clusterer}
                      position={{
                        lat: oNetwork.location.latitude,
                        lng: oNetwork.location.longitude,
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
