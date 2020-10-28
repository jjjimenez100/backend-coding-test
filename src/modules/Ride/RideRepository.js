class RideRepository {
  constructor(db, RideEntity, selectQuery, insertQuery) {
    this.db = db;
    this.RideEntity = RideEntity;
    this.selectQuery = selectQuery;
    this.insertQuery = insertQuery;
  }

  async getById(id) {
    const selectRideByIdQuery = 'SELECT * FROM Rides WHERE rideID = ?';
    const selectRideByIdValues = [id];
    const { results } = await this.selectQuery(this.db, selectRideByIdQuery, selectRideByIdValues);

    return results;
  }

  async getAll(page = 1, limit = 10) {
    const selectRidesQuery = 'SELECT * FROM Rides LIMIT ? OFFSET ?';
    const offset = (page - 1) * limit;
    const selectRidesValues = [limit, offset];
    const {
      results,
    } = await this.selectQuery(this.db, selectRidesQuery, selectRidesValues);

    return results;
  }

  async getTotalCount() {
    const countRidesQuery = 'SELECT COUNT(*) as count FROM Rides';
    const { results: countResult } = await this.selectQuery(this.db, countRidesQuery);
    const [{ count: totalCount }] = countResult;

    return totalCount;
  }

  async save(rideEntity) {
    const rideInstance = new this.RideEntity();
    // Use RiderEntity to verify model logic, e.g: lat should be between
    // 90, etc.
    rideInstance
      .startLat(rideEntity.startLat)
      .startLong(rideEntity.startLong)
      .endLat(rideEntity.endLat)
      .endLong(rideEntity.endLong)
      .riderName(rideEntity.riderName)
      .driverName(rideEntity.driverName)
      .driverVehicle(rideEntity.driverVehicle);

    const insertRideQuery = `
        INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
    const insertRideValues = [
      rideEntity.startLat,
      rideEntity.startLong,
      rideEntity.endLat,
      rideEntity.endLong,
      rideEntity.riderName,
      rideEntity.driverName,
      rideEntity.driverVehicle,
    ];
    const insertId = await this.insertQuery(this.db, insertRideQuery, insertRideValues);

    return insertId;
  }
}

module.exports = RideRepository;
