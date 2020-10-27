'use strict';

const request = require('supertest');
const assert = require('assert');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

const dummyRides = require('./resources/dummyRides.json');

const assertRideEntity = (dummyRide, actualRide) => {
  assert.strictEqual(actualRide.riderName, dummyRide.rider_name);
  assert.strictEqual(actualRide.driverName, dummyRide.driver_name);
  assert.strictEqual(actualRide.driverVehicle, dummyRide.driver_vehicle);
  assert.strictEqual(actualRide.endLat, dummyRide.end_lat);
  assert.strictEqual(actualRide.startLat, dummyRide.start_lat);
  assert.strictEqual(actualRide.endLong, dummyRide.end_long);
  assert.strictEqual(actualRide.startLong, dummyRide.start_long);
};

const assertRideValidationError = (propertiesToOverride, validationError, done) => {
  const body = { ...dummyRides[2], ...propertiesToOverride };
  request(app).
      post('/rides').
      send(body).
      expect('Content-Type', /json/).
      expect(200).
      expect(validationError)
      .end(done);
};

describe('API tests', () => {
  before((done) => {
    db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      done();
    });
  });

  describe('GET /health', () => {
    it('should return health', (done) => {
      request(app).
          get('/health').
          expect('Content-Type', /text/).
          expect(200, done);
    });
  });

  describe('Ride endpoints', () => {
    beforeEach((done) => {
      db.serialize((err) => {
        if (err) {
          return done(err);
        }
        db.run('DELETE FROM Rides', () => {
          const [dummyRideOne, dummyRideTwo] = dummyRides;
          const insertQuery = 'INSERT INTO Rides(startLat, startLong, endLat,' +
              ' endLong, riderName, driverName, driverVehicle) VALUES' +
              ' (?, ?, ?, ?, ?, ?, ?)';
          db.run(insertQuery, Object.values(dummyRideOne), () => {
            db.run(insertQuery, Object.values(dummyRideTwo), () => {
              db.run('UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE' +
                  ' NAME=\'Rides\';\n', () => {
                done();
              });
            });
          });
        });
      });
    });

    describe('GET /rides', () => {
      it('should return all rides', (done) => {
        request(app).
            get('/rides').
            expect('Content-Type', /json/).
            expect(200).
            expect(response => {
              const [ actualRideOne, actualRideTwo ] = response.body;
              const [ dummyRideOne, dummyRideTwo ] = dummyRides;
              assertRideEntity(dummyRideOne, actualRideOne);
              assertRideEntity(dummyRideTwo, actualRideTwo);
            })
            .end(done);
      });
    });

    describe('GET /rides/${id}', () => {
      it('should return ride id of 2', (done) => {
        request(app).
            get('/rides/2').
            expect('Content-Type', /json/).
            expect(200).
            expect(response => {
              const [ actualRideTwo ] = response.body;
              const [ , dummyRideTwo ] = dummyRides;
              assertRideEntity(dummyRideTwo, actualRideTwo);
            })
            .end(done);
      });
    });

    describe('POST /rides', () => {
      it('should create a new ride', (done) => {
        const body = dummyRides[2];
        request(app).
            post('/rides').
            send(body).
            expect('Content-Type', /json/).
            expect(200).
            expect(response => {
              const [ actualRide ] = response.body;
              assertRideEntity(body, actualRide);
            })
            .end(done);
      });

      describe('validation errors for start latitude', () => {
        const validationError = {
          error_code: 'VALIDATION_ERROR',
          message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
        };

        it('should give validation error for start latitude greater than 90', (done) => {
          const propertyWithError = { start_lat: 91 };
          assertRideValidationError(propertyWithError, validationError, done);
        });

        it('should give validation error for start latitude lower than -90', (done) => {
          const propertyWithError = { start_lat: -91 };
          assertRideValidationError(propertyWithError, validationError, done);
        });
      });

      describe('validation errors for start longitude', () => {
        const validationError = {
          error_code: 'VALIDATION_ERROR',
          message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
        };

        it('should give validation error for start longitude greater than 180', (done) => {
          const propertyWithError = { start_long: 181 };
          assertRideValidationError(propertyWithError, validationError, done);
        });

        it('should give validation error for start longitude lower than -180', (done) => {
          const propertyWithError = { start_long: -181 };
          assertRideValidationError(propertyWithError, validationError, done);
        });
      });

      describe('validation errors for rider name', () => {
        it('should give validation error for non-string rider name', (done) => {
          const validationError = {
            error_code: 'VALIDATION_ERROR',
            message: 'Rider name must be a non empty string',
          };
          const propertyWithError = { rider_name: 12 };
          assertRideValidationError(propertyWithError, validationError, done);
        });

        it('should give validation error for empty string rider name', (done) => {
          const validationError = {
            error_code: 'VALIDATION_ERROR',
            message: 'Rider name must be a non empty string',
          };
          const propertyWithError = { rider_name: '' };
          assertRideValidationError(propertyWithError, validationError, done);
        });
      });

      describe('validation errors for driver name', () => {
        it('should give validation error for non-string driver name', (done) => {
          const validationError = {
            error_code: 'VALIDATION_ERROR',
            message: 'Rider name must be a non empty string',
          };
          const propertyWithError = { driver_name: 12 };
          assertRideValidationError(propertyWithError, validationError, done);
        });

        it('should give validation error for empty string driver name', (done) => {
          const validationError = {
            error_code: 'VALIDATION_ERROR',
            message: 'Rider name must be a non empty string',
          };
          const propertyWithError = { driver_name: '' };
          assertRideValidationError(propertyWithError, validationError, done);
        });
      });

      describe('validation errors for driver vehicle', () => {
        it('should give validation error for non-string driver vehicle', (done) => {
          const validationError = {
            error_code: 'VALIDATION_ERROR',
            message: 'Rider name must be a non empty string',
          };
          const propertyWithError = { driver_vehicle: 12 };
          assertRideValidationError(propertyWithError, validationError, done);
        });

        it('should give validation error for empty string driver vehicle', (done) => {
          const validationError = {
            error_code: 'VALIDATION_ERROR',
            message: 'Rider name must be a non empty string',
          };
          const propertyWithError = { driver_vehicle: '' };
          assertRideValidationError(propertyWithError, validationError, done);
        });
      });
    });
  });
});