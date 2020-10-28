class RideEntity {
  constructor() {
    this._rideID = null;
    this._startLat = null;
    this._startLong = null;
    this._endLat = null;
    this._endLong = null;
    this._riderName = null;
    this._driverName = null;
    this._driverVehicle = null;
    this._created = null;
  }

  rideId(id) {
    this._rideID = id;
    return this;
  }

  startLat(startlat) {
    if (startlat < -90 || startlat > 90) {
      throw new Error('ModelError: startLat should be not be greater than 90 or less'
          + ' than -90');
    }
    this._startLat = startlat;
    return this;
  }

  startLong(startlong) {
    if (startlong < -180 || startlong > 180) {
      throw new Error('ModelError: startLong should be not be greater than 180 or less'
          + ' than -180');
    }
    this._startLong = startlong;
    return this;
  }

  endLat(endlat) {
    if (endlat < -90 || endlat > 90) {
      throw new Error('ModelError: endlat should be not be greater than 90 or'
          + ' less'
          + ' than -90');
    }
    this._endLat = endlat;
    return this;
  }

  endLong(endlong) {
    if (endlong < -180 || endlong > 180) {
      throw new Error('ModelError: endLong should be not be greater than 180 or less'
          + ' than -180');
    }
    this._endLong = endlong;
    return this;
  }

  riderName(ridername) {
    this._riderName = ridername;
    return this;
  }

  driverName(drivername) {
    this._driverName = drivername;
    return this;
  }

  driverVehicle(drivervehicle) {
    this._driverVehicle = drivervehicle;
    return this;
  }

  created(createdDate) {
    this._created = createdDate;
    return this;
  }
}

module.exports = RideEntity;
