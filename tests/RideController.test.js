const RideController = require('../src/modules/Ride/RideController');
const DummyResponse = require('./DummyResponse');
const assert = require('assert');
const HttpStatusCodes = require('http-status-codes');

describe('RideController test cases', () => {
  it('should return mock data when calling getRides', async () => {
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
    const rideRepositoryMock = {
      getAll: async () => mockData,
      getTotalCount: async () => mockData.length,
    };
    const rideControllerInstance = new RideController(rideRepositoryMock);

    const requestMock = {
      query: {
        page: '1',
        limit: '10',
      },
    };
    const responseMock = new DummyResponse();
    await rideControllerInstance.getRides(requestMock, responseMock, null);
    const { next, previous, results } = responseMock.body;
    assert.strictEqual(next, null);
    assert.strictEqual(previous, null);
    assert.deepStrictEqual(results, mockData);
  });

  it('should throw validation when calling getRides with invalid limit value', async () => {
    const rideRepositoryMock = {};
    const rideControllerInstance = new RideController(rideRepositoryMock);

    const requestMock = {
      query: {
        page: '1',
        limit: 'hello',
      },
    };
    const responseMock = new DummyResponse();
    await rideControllerInstance.getRides(requestMock, responseMock, null);
    assert.deepStrictEqual(responseMock.body, { message: 'Limit should be a' +
          ' number greater than 1' });
    assert.strictEqual(responseMock.code, HttpStatusCodes.BAD_REQUEST);
  });

  it('should throw validation when calling getRides with invalid page value', async () => {
    const rideRepositoryMock = {};
    const rideControllerInstance = new RideController(rideRepositoryMock);

    const requestMock = {
      query: {
        page: 'hello',
        limit: '1',
      },
    };
    const responseMock = new DummyResponse();
    await rideControllerInstance.getRides(requestMock, responseMock, null);
    assert.deepStrictEqual(responseMock.body, { message: 'Page should be a' +
          ' number greater than 1' });
    assert.strictEqual(responseMock.code, HttpStatusCodes.BAD_REQUEST);
  });

  it('should return mock data when calling getRide', async () => {
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
      }
    ];
    const rideRepositoryMock = {
      getById: async () => mockData,
    };
    const rideControllerInstance = new RideController(rideRepositoryMock);
    const requestMock = {
      params: {
        id: 4,
      },
    };
    const responseMock = new DummyResponse();
    await rideControllerInstance.getRide(requestMock, responseMock, null);
    assert.deepStrictEqual(responseMock.body, mockData);
  });

  it('should throw validation error when calling getRide with invalid id', async () => {
    const rideRepositoryMock = {
      getById: async () => {},
    };
    const rideControllerInstance = new RideController(rideRepositoryMock);
    const requestMock = {
      params: {
        id: 'hello',
      },
    };
    const responseMock = new DummyResponse();
    await rideControllerInstance.getRide(requestMock, responseMock, null);
    assert.deepStrictEqual(responseMock.body, { message: 'ID should be a positive number greater than 0'});
    assert.strictEqual(responseMock.code, HttpStatusCodes.BAD_REQUEST);
  });

  it('should return mock last insert id when calling postRide', async () => {
    const mockData = {
      "start_lat": 90,
      "start_long": 180,
      "end_lat": -90,
      "end_long": -180,
      "rider_name": "Joshua",
      "driver_name": "John",
      "driver_vehicle": "Truck"
    };
    const rideRepositoryMock = {
      save: async () => 4,
      getById: async () => mockData,
    };
    const rideControllerInstance = new RideController(rideRepositoryMock);
    const requestMock = {
      body: mockData,
    };
    const responseMock = new DummyResponse();
    await rideControllerInstance.postRide(requestMock, responseMock, null);
    assert.strictEqual(responseMock.body, mockData);
  });

  it('should validation error for error thrown by RideEntity', async () => {
    const mockData = {
      "start_lat": 90,
      "start_long": 180,
      "end_lat": -90,
      "end_long": -180,
      "rider_name": "Joshua",
      "driver_name": "John",
      "driver_vehicle": "Truck"
    };
    const errorMessage = 'ModelError: startLat should be not be greater than 90 or less'
        + ' than -90';
    const rideRepositoryMock = {
      save: async () => {
        throw new Error(errorMessage);
      },
      getById: async () => mockData,
    };
    const rideControllerInstance = new RideController(rideRepositoryMock);
    const requestMock = {
      body: mockData,
    };
    const responseMock = new DummyResponse();
    await rideControllerInstance.postRide(requestMock, responseMock, null);
    assert.strictEqual(responseMock.code, HttpStatusCodes.BAD_REQUEST);
    assert.deepStrictEqual(responseMock.body, { message: errorMessage });
  });

  it('should give validation error when calling postRide with missing' +
      ' rider_name', async () => {
    const mockData = {
      "start_lat": 90,
      "start_long": 180,
      "end_lat": -90,
      "end_long": -180,
      "driver_name": "John",
      "driver_vehicle": "Truck"
    };
    const rideRepositoryMock = {};
    const rideControllerInstance = new RideController(rideRepositoryMock);
    const requestMock = {
      body: mockData,
    };
    const responseMock = new DummyResponse();
    await rideControllerInstance.postRide(requestMock, responseMock, null);
    assert.strictEqual(responseMock.code, HttpStatusCodes.BAD_REQUEST);
    assert.deepStrictEqual(responseMock.body, { message: 'rider_name must be' +
          ' a non-empty string'});
  });

  it('should give validation error when calling postRide with missing' +
      ' start_lat', async () => {
    const mockData = {
      "start_long": 180,
      "end_lat": -90,
      "end_long": -180,
      "driver_name": "John",
      "driver_vehicle": "Truck",
      "rider_name": "Robert",
    };
    const rideRepositoryMock = {};
    const rideControllerInstance = new RideController(rideRepositoryMock);
    const requestMock = {
      body: mockData,
    };
    const responseMock = new DummyResponse();
    await rideControllerInstance.postRide(requestMock, responseMock, null);
    assert.strictEqual(responseMock.code, HttpStatusCodes.BAD_REQUEST);
    assert.deepStrictEqual(responseMock.body, { message: 'start_lat must be a numeric value'});
  });
});