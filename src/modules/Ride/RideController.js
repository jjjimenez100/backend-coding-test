const isInteger = require('validator/lib/isInt');
const isEmpty = require('validator/lib/isEmpty');
const HttpStatusCodes = require('http-status-codes');

class RideController {
  constructor(rideRepositoryInstance) {
    this.rideRepositoryInstance = rideRepositoryInstance;
  }

  async getRides(req, res, next) {
    const { page = 1, limit = 10 } = req.query;
    if (page && !isInteger(`${page}`, { min: 1 })) {
      return res.status(HttpStatusCodes.BAD_REQUEST).send({
        message: 'Page should be a number greater than 1',
      });
    }

    if (limit && !isInteger(`${limit}`, { min: 1 })) {
      return res.status(HttpStatusCodes.BAD_REQUEST).send({
        message: 'Limit should be a number greater than 1',
      });
    }

    try {
      const results = await this.rideRepositoryInstance.getAll(page, limit);
      const parsedPage = Number(page);
      const nextUrl = `/rides?page=${parsedPage + 1}&limit=${limit}`;
      const previousUrl = parsedPage === 1 ? null : `/rides?page=${parsedPage - 1}&limit=${limit}`;

      const totalCount = await this.rideRepositoryInstance.getTotalCount();
      const hasNextPage = (page * Number(limit)) <= totalCount;
      const response = {
        next: hasNextPage ? nextUrl : null,
        previous: previousUrl,
        totalCount,
        results,
      };
      res.send(response);
    } catch (err) {
      next(err);
    }
  }

  async getRide(req, res, next) {
    const { id } = req.params;
    if (isNaN(id) || id < 0) {
      return res.status(HttpStatusCodes.BAD_REQUEST).send({
        message: 'ID should be a positive number greater than 0',
      });
    }

    try {
      const results = await this.rideRepositoryInstance.getById(id);
      res.send(results);
    } catch (err) {
      next(err);
    }
  }

  async postRide(req, res, next) {
    const stringPropertiesToCheck = [
      'rider_name',
      'driver_name',
      'driver_vehicle',
    ];
    const missingStringProperty = stringPropertiesToCheck.find(
      (propertyToCheck) => isEmpty(req.body[propertyToCheck] ? `${req.body[propertyToCheck]}` : ''),
    );

    if (missingStringProperty) {
      return res.status(HttpStatusCodes.BAD_REQUEST).send({
        message: `${missingStringProperty} must be a non-empty string`,
      });
    }

    const numericPropertiesToCheck = [
      'start_lat',
      'start_long',
      'end_lat',
      'end_long',
    ];
    const missingNumericProperty = numericPropertiesToCheck.find(
      (propertyToCheck) => isNaN(req.body[propertyToCheck]),
    );

    if (missingNumericProperty) {
      return res.status(HttpStatusCodes.BAD_REQUEST).send({
        message: `${missingNumericProperty} must be a numeric value`,
      });
    }

    const startLat = Number(req.body.start_lat);
    const startLong = Number(req.body.start_long);
    const endLat = Number(req.body.end_lat);
    const endLong = Number(req.body.end_long);
    const riderName = req.body.rider_name;
    const driverName = req.body.driver_name;
    const driverVehicle = req.body.driver_vehicle;

    try {
      const rideEntity = {
        startLat,
        startLong,
        endLat,
        endLong,
        riderName,
        driverName,
        driverVehicle,
      };
      const lastId = await this.rideRepositoryInstance.save(rideEntity);
      const result = await this.rideRepositoryInstance.getById(lastId);
      res.send(result);
    } catch (err) {
      if (err.message.includes('ModelError')) {
        return res.status(HttpStatusCodes.BAD_REQUEST).send({
          message: err.message,
        });
      }
      next(err);
    }
  }
}

module.exports = RideController;
