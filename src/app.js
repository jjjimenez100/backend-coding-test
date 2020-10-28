const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./resources/api-v1-swagger.json');

const { errorHandler } = require('./lib/errorHandler');
const RideRepository = require('./modules/Ride/RideRepository');
const RideController = require('./modules/Ride/RideController');
const RideEntity = require('./modules/Ride/RideEntity');
const { selectQuery, insertQuery } = require('./lib/databaseQuery');

module.exports = (db) => {
  // Manually inject instances
  const repository = new RideRepository(db, RideEntity, selectQuery, insertQuery);
  const controller = new RideController(repository);

  app.get('/health', (req, res) => res.send('Healthy'));

  app.use('/api-documentation/v1', swaggerUI.serve, swaggerUI.setup(swaggerFile));

  app.post('/rides', jsonParser, function (req, res, next) {
    controller.postRide(req, res, next);
  });
  app.get('/rides', function (req, res, next) {
    controller.getRides(req, res, next);
  });
  app.get('/rides/:id', function (req, res, next) {
    controller.getRide(req, res, next);
  });

  app.use(errorHandler);

  return app;
};
