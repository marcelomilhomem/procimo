const express = require("express");
const app = express();
const axios = require("axios");
const PORT = process.env.REACT_APP_PORT || 5000;
const fs = require("fs");

const url = "http://api.citybik.es/v2/networks";

try {
  axios(url).then((res) => {
    const data = res.data;

    const content = [];

    data.networks.map((el) => {
      return content.push({
        latitude: el.location.latitude,
        longitude: el.location.longitude,
      });
    });

    app.get("/", (req, res) => {
      res.json(content);
    });
    const jsonContent = JSON.stringify(content);
    fs.writeFile("./locations.json", jsonContent, "utf8", (err) => {
      if (err) {
        console.log(err);
      }
      console.log("The file was saved!");
    });
  });
} catch (error) {
  console.log(error, error.message);
}

app.listen(PORT);
