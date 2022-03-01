const http = require("http");
require('dotenv').config();

const app = require("./app");
const {mongoConnect} = require('./services/mongo');
const { loadPlanetsData } = require("./models/planets.model");
const { loadSpaceXLaunchesData } = require("./models/launches.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const startServer = async () => {
  await mongoConnect();
  await loadPlanetsData();
  await loadSpaceXLaunchesData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
};

startServer();
