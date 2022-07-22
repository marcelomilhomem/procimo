import React, { useDebugValue } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  MarkerClusterer,
  InfoWindow,
} from "@react-google-maps/api";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Api from "../service/api.js";

//Using styled-components to Style map-size
const Div = styled.div`
  height: 400px;
  width: 100%;
`;

function MapPage() {
  //Using States for Data
  const [networks, setNetworks] = useState([]);
  const [clusters, setClusters] = useState(new Map());
  const [networkStations, setNetworkStations] = useState([]);

  const [selectedId, setSelectedId] = useState();

  //Variables to display the networks and stations
  const [showNetworks, setShowNetworks] = useState(true);
  const [showStations, setShowStations] = useState(false);

  //Get all networks from API.
  const fetchApi = async () => {
    try {
      let response = await Api.fetchNetworks();
      setNetworks(response.data.networks);
    } catch (error) {
      console.log(error);
    }
  };

  //Clicking each marker, get stations from each Network ID
  const handleOnClick = async () => {
    try {
      let response = await Api.fetchStations(selectedId);
      setNetworkStations(response.data.network.stations);
      setNetworkStations(false);
      console.log(response.data.network.stations);
    } catch (error) {
      console.log(error);
    }
  };

  //Load the map with Networks opening the page
  useEffect(() => {
    fetchApi();
  }, []);

  const onShowPopup = (id) => {
    const aUpdated = networks.map((oNetwork) => {
      return (oNetwork.bShow = oNetwork.id === id);
    });
    setSelectedId(id);
    setNetworks(aUpdated);
  };

  //Map Countries
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
          zoom={3.5}
          onLoad={onMapLoaded}
        >
          {Array.from(clusters.values()).map((oEntry) => {
            return (
              <MarkerClusterer>
                {(clusterer) =>
                  oEntry.map((oNetwork) => (
                    <Marker
                      id="map_marker"
                      key={oNetwork.id}
                      onClick={() => {
                        onShowPopup(oNetwork.id);
                        //handleOnClick(oNetwork.id);
                      }}
                      clusterer={clusterer}
                      position={{
                        lat: oNetwork.location.latitude,
                        lng: oNetwork.location.longitude,
                      }}
                    >
                      {oNetwork.bShow && (
                        <InfoWindow
                          position={{
                            lat: oNetwork.location.latitude,
                            lng: oNetwork.location.longitude,
                          }}
                        >
                          <div>
                            <h1>{oNetwork.location.city} Network Selected</h1>
                            <button onClick={handleOnClick}>
                              Show Stations
                            </button>
                          </div>
                        </InfoWindow>
                      )}
                    </Marker>
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
