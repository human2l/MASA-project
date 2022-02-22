const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["KAI", "MASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

const existsLaunchWithId = (launchId) => {
  return launches.has(launchId)
}

const getAllLaunches = () => {
  return Array.from(launches.values())
}

const addNewLaunch = (launch) => {
  latestFlightNumber++;
  const newLaunch = {
    ...launch,
    success: true,
    upcoming: true,
    customers: ["KAI", "MASA"],
    flightNumber:latestFlightNumber,
  }
  launches.set(latestFlightNumber, newLaunch)
  return newLaunch
}

const abortLaunchById = (launchId) => {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted
}


module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById
};