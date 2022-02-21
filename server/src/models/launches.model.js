const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  destination: "Kepler-442 b",
  customer: ["KAI", "MASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

const getAllLaunches = () => {
  return Object.fromEntries(launches)
}

const addNewLaunch = (launch) => {
  latestFlightNumber++;
  const newLaunch = {
    ...launch,
    success: true,
    upcoming: true,
    customer: ["KAI", "MASA"],
    flightNumber:latestFlightNumber,
  }
  launches.set(latestFlightNumber, newLaunch)
  return newLaunch
}


module.exports = {
  getAllLaunches,
  addNewLaunch,
};