const RideEntity = require('../src/modules/Ride/RideEntity');
const assert = require('assert');

describe('RideEntity test cases', () => {
  it('should be initialized with all null values', () => {
    const rideInstance = new RideEntity();
    assert.strictEqual(rideInstance._rideID , null);
    assert.strictEqual(rideInstance._startLat , null);
    assert.strictEqual(rideInstance._startLong , null);
    assert.strictEqual(rideInstance._endLat , null);
    assert.strictEqual(rideInstance._endLong , null);
    assert.strictEqual(rideInstance._riderName , null);
    assert.strictEqual(rideInstance._driverName , null);
    assert.strictEqual(rideInstance._driverVehicle , null);
    assert.strictEqual(rideInstance._created , null);
  });

  it('should be initialized with given values', () => {
    const dummyRide = {
      "rideID": 5,
      "startLat": 12,
      "startLong": 14,
      "endLat": 19,
      "endLong": 19,
      "riderName": "Joshua",
      "driverName": "John",
      "driverVehicle": "Truck",
      "created": "2020-10-28 15:01:11"
    };
    const rideInstance = new RideEntity();
    rideInstance
      .rideId(dummyRide.rideID)
      .startLat(dummyRide.startLat)
      .startLong(dummyRide.startLong)
      .endLat(dummyRide.endLat)
      .endLong(dummyRide.endLong)
      .riderName(dummyRide.riderName)
      .driverName(dummyRide.driverName)
      .driverVehicle(dummyRide.driverVehicle)
      .created(dummyRide.created)
    assert.strictEqual(rideInstance._rideID , dummyRide.rideID);
    assert.strictEqual(rideInstance._startLat , dummyRide.startLat);
    assert.strictEqual(rideInstance._startLong , dummyRide.startLong);
    assert.strictEqual(rideInstance._endLat , dummyRide.endLat);
    assert.strictEqual(rideInstance._endLong , dummyRide.endLong);
    assert.strictEqual(rideInstance._riderName , dummyRide.riderName);
    assert.strictEqual(rideInstance._driverName , dummyRide.driverName);
    assert.strictEqual(rideInstance._driverVehicle , dummyRide.driverVehicle);
    assert.strictEqual(rideInstance._created , dummyRide.created);
  });

  it('should throw an error if startLat is less than -90', () => {
    try {
      const rideInstance = new RideEntity();
      rideInstance.startLat(-91);
      assert.fail('startLat should throw an error');
    } catch (err) {}
  })

  it('should throw an error if startLat is more than 90', () => {
    try {
      const rideInstance = new RideEntity();
      rideInstance.startLat(91);
      assert.fail('startLat should throw an error');
    } catch (err) {}
  })

  it('should throw an error if endLat is less than -90', () => {
    try {
      const rideInstance = new RideEntity();
      rideInstance.endLat(-91);
      assert.fail('endLat should throw an error');
    } catch (err) {}
  })

  it('should throw an error if endLat is more than 90', () => {
    try {
      const rideInstance = new RideEntity();
      rideInstance.endLat(91);
      assert.fail('endLat should throw an error');
    } catch (err) {}
  })

  //
  it('should throw an error if startLong is less than -180', () => {
    try {
      const rideInstance = new RideEntity();
      rideInstance.startLong(-181);
      assert.fail('startLong should throw an error');
    } catch (err) {}
  })

  it('should throw an error if startLong is more than 180', () => {
    try {
      const rideInstance = new RideEntity();
      rideInstance.startLong(181);
      assert.fail('startLong should throw an error');
    } catch (err) {}
  })

  it('should throw an error if endLong is less than -181', () => {
    try {
      const rideInstance = new RideEntity();
      rideInstance.endLong(-181);
      assert.fail('endLong should throw an error');
    } catch (err) {}
  })

  it('should throw an error if endLong is more than 181', () => {
    try {
      const rideInstance = new RideEntity();
      rideInstance.endLong(181);
      assert.fail('endLong should throw an error');
    } catch (err) {}
  })
});