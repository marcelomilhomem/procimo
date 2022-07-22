import axios from "axios";

class CityBike {
  constructor() {
    this.api = axios.create({
      baseURL: "http://api.citybik.es/v2/networks",
    });
  }

  fetchNetworks = () => {
    return this.api.get();
  };

  fetchStations = (id) => {
    return this.api.get(`/${id}`);
  };
}

const bikeService = new CityBike();

export default bikeService;