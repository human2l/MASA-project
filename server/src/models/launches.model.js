const axios = require('axios');

const launchesDatabase = require('./launches.mongo')
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

const populateSpaceXLaunches = async () => {
  console.log("downloading from spaceX...")
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          }
        },
        {
          path: 'payloads',
          select: {
            'customers': 1
          }
        }
      ]
    }
  })

  if(response.status !== 200) {
    console.log('Problem downloading launch data from SpaceX')
    throw new Error('Launch data download failed')
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers: launchDoc.payloads.reduce((pre,cur) => 
      [...pre,...cur.customers]
      ,[])
    }
    saveLaunch(launch)
  }
}

const loadSpaceXLaunchesData = async () => {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  })
  firstLaunch ? 
  console.log('Launch data already loaded!') 
  : 
  populateSpaceXLaunches()
}

const findLaunch = async (filter) => { 
  return await launchesDatabase.findOne(filter)
}

const existsLaunchWithId = async (launchId) => {
  return await findLaunch({
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
  await launchesDatabase.updateOne({
    flightNumber: launch.flightNumber,
  },launch,{
    upsert: true,
  })
}

const scheduleNewLaunch = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.target,
  })

  if(!planet) {
    throw new Error('No matching planet found')
  }

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
  abortLaunchById,
  loadSpaceXLaunchesData
};