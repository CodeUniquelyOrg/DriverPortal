import { cleanUpResponse } from 'lib/utils';

// internal list representation
let data = [];

// clear the list
const clear = () => {
  data = [];
};

// =======================================================
// find vehicle by identifier in exiting data or create it
// =======================================================
const getVehicle = (record) => {
  let found;
  for (let i = 0; i < data.length; i++) {
    if (data[i].vehicleId === record.vehicleId) {
      found = data[i];
      break;
    }
  }
  if (!found) {
    found = {
      vehicleId: record.vehicleId,
      newVehicleId: record.newVehicleId,
      identifiedAs: record.identifiedAs,
      isRegistered: record.isRegistered,
      history: [],
    };
    data.push(found);
  }
  return found;
};

// =======================================================
// Combine the various queries into single vehicles
// vehicleId: ''
// newVehicleId: ''
// identifiedAs: ''
// fromDate: ''
// location: ''
// isRegistered: t/f
// tyres: []
// =======================================================
export const combineResults = (response) => {
  // where the data is going to go
  clear();

  // there may be more than one task that ran
  response.forEach(task => {
    let vehicle;

    console.log('\n'); // eslint-disable-line no-console
    console.log(cleanUpResponse(task)); // eslint-disable-line no-console
    console.log('\n'); // eslint-disable-line no-console

    // ***** TEMP FIX NEED TO FIND OUT WHY WE GOT A MISSING VEHICLE ******
    if (task.body && task.status === 200) {
      // records in task wil be for same vehicle
      task.body.forEach(record => {
        vehicle = getVehicle(record);

        const fromDate = record.fromDate;
        const location = record.location;
        const tyres = record.tyres;

        const driveOver = {
          fromDate,
          location,
          tyres,
        };

        // just push them into the first record
        vehicle.history.push(driveOver);
      });
    }
  });
  return data;
};
