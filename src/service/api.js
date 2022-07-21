import axios from "axios";

class CityBike {
  constructor() {
    this.api = axios.create({
      baseURL: "http://api.citybik.es/v2/networks",
    });
  }

  gNetworks = () => {
    return this.api.get();
  };

  gStations = (id) => {
    return this.api.get(`/${id}`);
  };
}

const bikeService = new CityBike();

export default bikeService;