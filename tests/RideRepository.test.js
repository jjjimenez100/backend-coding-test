const RideRepository = require('../src/modules/Ride/RideRepository');
const RideEntity = require('../src/modules/Ride/RideEntity');

const assert = require('assert');

describe('RideRepository test cases', () => {
  it('should return mock data when calling getById', async () => {
    const mockData = [{
      "rideID": 5,
      "startLat": 12,
      "startLong": 14,
      "endLat": 19,
      "endLong": 19,
      "riderName": "Joshua",
      "driverName": "John",
      "driverVehicle": "Truck",
      "created": "2020-10-28 15:01:11"
    }];

    const selectQuery = async () => ({ results: mockData });
    const rideRepository = new RideRepository(null, null, selectQuery, null);
    const results = await rideRepository.getById(12);
    assert.deepStrictEqual(results, mockData);
  });

  it('should return mock data when calling getAll', async () => {
    const mockData = [
      {
        "rideID": 4,
        "startLat": 12,
        "startLong": 14,
        "endLat": 19,
        "endLong": 19,
        "riderName": "Joshua",
        "driverName": "John",
        "driverVehicle": "Truck",
        "created": "2020-10-28 15:01:11"
      },
      {
        "rideID": 5,
        "startLat": 12,
        "startLong": 14,
        "endLat": 19,
        "endLong": 19,
        "riderName": "Joshua",
        "driverName": "John",
        "driverVehicle": "Truck",
        "created": "2020-10-28 15:01:11"
      },
      {
        "rideID": 6,
        "startLat": 12,
        "startLong": 14,
        "endLat": 19,
        "endLong": 19,
        "riderName": "Joshua",
        "driverName": "John",
        "driverVehicle": "Truck",
        "created": "2020-10-28 15:01:12"
      }
    ];

    const selectQuery = async () => ({ results: mockData });
    const rideRepository = new RideRepository(null, null, selectQuery, null);
    const results = await rideRepository.getAll();
    assert.deepStrictEqual(results, mockData);
  });

  it('should return mock total count when calling getTotalCount', async () => {
    const results = [
      {
        count: 15,
      }
    ];
    const selectQuery = async () => ({ results });
    const rideRepository = new RideRepository(null, null, selectQuery, null);
    const totalCount = await rideRepository.getTotalCount();
    assert.deepStrictEqual(totalCount, 15);
  });

  it('should return mock last id when calling save', async () => {
    const dummyRide = {
      "startLat": 12,
      "startLong": 14,
      "endLat": 19,
      "endLong": 19,
      "riderName": "Joshua",
      "driverName": "John",
      "driverVehicle": "Truck",
    };
    const insertQuery = async () => 5;
    const rideRepository = new RideRepository(null, RideEntity, null, insertQuery);
    const insertId = await rideRepository.save(dummyRide);
    assert.deepStrictEqual(insertId, 5);
  });
});