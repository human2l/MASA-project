const launchesDatabase = require('./launches.mongo')
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100

const existsLaunchWithId = async (launchId) => {
  return await launchesDatabase.findOne({
    flightNumber: launchId
  })
}

const getLatestFlightNumber = async () => {
  const latestLaunch = await launchesDatabase
    .findOne()
    .sort("-flightNumber")
  if(!latestLaunch) return DEFAULT_FLIGHT_NUMBER
  return latestLaunch.flightNumber;
}

const getAllLaunches = async () => {
  return await launchesDatabase.find({})
}

const saveLaunch = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.target,
  })

  if(!planet) {
    throw new Error('No matching planet found')
  }

  await launchesDatabase.updateOne({
    flightNumber: launch.flightNumber,
  },launch,{
    upsert: true,
  })
}

const scheduleNewLaunch = async (launch) => {
  const newFlightNumber = await getLatestFlightNumber() + 1;
  const newLaunch = {
    ...launch,
    success: true,
    upcoming: true,
    customers: ["KAI", "MASA"],
    flightNumber: newFlightNumber,
  }
  await saveLaunch(newLaunch)
}

const abortLaunchById = async (launchId) => {
  const aborted = await launchesDatabase.updateOne({
    flightNumber:launchId,
  }, {
    upcoming: false,
    success: false,
  })
  return aborted.acknowledged && aborted.modifiedCount === 1
}


module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById
};