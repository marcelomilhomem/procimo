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
import ReactDOM from "react-dom";

const DivMap = styled.div`
  height: 500px;
  width: 100%;
`;

function MapPage() {
  //Using States for Data
  const [networks, setNetworks] = useState([]);
  const [clusters, setClusters] = useState(new Map());
  const [stations, setStations] = useState([]);

  const [selectedId, setSelectedId] = useState();

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
  const onClickShowStations = async () => {
    try {
      let response = await Api.fetchStations(selectedId);
      setStations(
        response.data.network.stations.map((oStation) => {
          oStation.location = {
            latitude: oStation.latitude,
            longitude: oStation.longitude,
            country: response.data.network.location.country,
          };
          return oStation;
        })
      );
      upDateClustersState(stations);
    } catch (error) {
      console.log(error);
    }
  };

  //Load the map with Networks opening the page
  useEffect(() => {
    fetchApi();
  }, []);

  //Function trigged by event onClick
  //Search in all networks with the ID clicked and create a new property bShowPopup all false and change to true if match the ID
  //Then update ID state and Network State
  const onShowPopup = (id) => {
    console.log(id);
    let aUpdated;
    if (id) {
      aUpdated = networks.map((oNetwork) => {
        oNetwork.bShowPopup = oNetwork.id === id;
        return oNetwork;
      });
    } else {
      aUpdated = stations.map((oStation) => {
        oStation.bShowPopup = oStation.id === id;
        return oStation;
      });
    }
    setSelectedId(id);
    setNetworks(aUpdated);
  };

  //Fuction trigged by onCloseClick
  //Map all networks and turn bShowPopup to false and update ID to null
  const onClosePopup = () => {
    const aUpdated = networks.map((oNetwork) => {
      oNetwork.bShowPopup = false;
      return oNetwork;
    });
    setSelectedId();
    setNetworks(aUpdated);
  };

  const onMapLoaded = (oMap) => {
    upDateClustersState(networks);
    const google = window.google;
    const controlButtonDiv = document.createElement("div");
    ReactDOM.render(
      <button onClick={onBackButtonPress}>Back to Networks</button>,
      controlButtonDiv
    );
    oMap.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlButtonDiv);
  };

  //Buckets Countries
  const upDateClustersState = (aEntries) => {
    const oClusters = new Map();
    let aMarkers;
    aEntries.forEach((oEntry) => {
      aMarkers = oClusters.get(oEntry.location.country);
      if (!aMarkers) {
        oClusters.set(oEntry.location.country, [oEntry]);
      } else {
        aMarkers.push(oEntry);
        oClusters.set(oEntry.location.country, aMarkers);
      }
    });
    setClusters(oClusters);
  };

  const onBackButtonPress = () => {
    upDateClustersState(networks);
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.REACT_APP_API_KEY}`,
  });

  return (
    <DivMap>
      {isLoaded ? (
        <GoogleMap
          id="map"
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={{ lat: 38.72726949547492, lng: -9.139262879074261 }}
          zoom={3.5}
          onLoad={(oMap) => onMapLoaded(oMap)}
        >
          {Array.from(clusters.values()).map((oEntry) => {
            return (
              <MarkerClusterer>
                {(clusterer) =>
                  oEntry.map((oNetwork) => (
                    <Marker
                      id="map_marker"
                      key={oNetwork.id}
                      onClick={() => onShowPopup(oNetwork.id)}
                      clusterer={clusterer}
                      position={{
                        lat: oNetwork.location.latitude,
                        lng: oNetwork.location.longitude,
                      }}
                    >
                      {oNetwork.bShowPopup && (
                        <InfoWindow
                          onCloseClick={onClosePopup}
                          position={{
                            lat: oNetwork.location.latitude,
                            lng: oNetwork.location.longitude,
                          }}
                        >
                          <div>
                            <h1>{oNetwork.location.city} Bike's Network</h1>
                            <button onClick={onClickShowStations}>
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
    </DivMap>
  );
}

export default MapPage;
