const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./resources/api-v1-swagger.json');

const { errorHandler } = require('./lib/errorHandler');

module.exports = (db) => {
  app.get('/health', (req, res) => res.send('Healthy'));

  app.use('/api-documentation/v1', swaggerUI.serve, swaggerUI.setup(swaggerFile));

  app.post('/rides', jsonParser, (req, res, next) => {
    const startLatitude = Number(req.body.start_lat);
    const startLongitude = Number(req.body.start_long);
    const endLatitude = Number(req.body.end_lat);
    const endLongitude = Number(req.body.end_long);
    const riderName = req.body.rider_name;
    const driverName = req.body.driver_name;
    const driverVehicle = req.body.driver_vehicle;

    if (
      startLatitude < -90
        || startLatitude > 90
        || startLongitude < -180
        || startLongitude > 180
    ) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
      });
    }

    if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
      });
    }

    if (typeof riderName !== 'string' || riderName.length < 1) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    if (typeof driverName !== 'string' || driverName.length < 1) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    const values = [
      req.body.start_lat,
      req.body.start_long,
      req.body.end_lat,
      req.body.end_long,
      req.body.rider_name,
      req.body.driver_name,
      req.body.driver_vehicle,
    ];

    db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (insertErr) {
      if (insertErr) {
        return next(insertErr);
      }
      db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, (selectErr, rows) => {
        if (selectErr) {
          return next(selectErr);
        }
        res.send(rows);
      });
    });
  });

  app.get('/rides', (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return res.send({
        error_code: 'INVALID_PAGINATION_VALUES',
        message: 'Pagination values should be a number and not be less than 1',
      });
    }

    const offset = (page - 1) * limit;
    const parsedPage = Number(page);
    const nextUrl = `/rides?page=${parsedPage + 1}&limit=${limit}`;
    const previousUrl = parsedPage === 1 ? null : `/rides?page=${parsedPage - 1}&limit=${limit}`;

    db.all('SELECT * FROM Rides LIMIT ? OFFSET ?', [limit, offset], (err, rideEntities) => {
      if (err) {
        return next(err);
      }

      if (rideEntities.length === 0) {
        return res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }

      db.all('SELECT COUNT(*) as count FROM Rides', (countError, rows) => {
        if (countError) {
          return next(countError);
        }

        const totalCount = rows[0].count;
        const hasNextPage = (page * limit) <= totalCount;
        const response = {
          next: hasNextPage ? nextUrl : null,
          previous: previousUrl,
          totalCount: rows[0].count,
          results: rideEntities,
        };
        res.send(response);
      });
    });
  });

  app.get('/rides/:id', (req, res, next) => {
    db.all(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`, (err, rows) => {
      if (err) {
        return next(err);
      }

      if (rows.length === 0) {
        return res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }

      res.send(rows);
    });
  });

  app.use(errorHandler);

  return app;
};
