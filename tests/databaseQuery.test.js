const sinon = require('sinon');
const assert=  require('assert');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const buildSchemas = require('../src/schemas');

const {
  selectQuery, insertQuery, deleteQuery, updateQuery,
} = require('../src/lib/databaseQuery');

describe('Database query utility tests', () => {
  describe('Stub tests not calling actual db', () => {
    it('selectQuery should call db.serialize and db.each once', (done) => {
      const db = {
        serialize: () => {},
        each: () => {},
        run: () => {},
      };
      const each = sinon.stub(db, 'each');
      const serialize = sinon.stub(db, 'serialize').callsFake(() => db.each());
      selectQuery(db);
      each.restore();
      sinon.assert.calledOnce(each);
      sinon.assert.calledOnce(serialize);
      done();
    });

    it('insertQuery should call db.run once', (done) => {
      const db = {
        run: () => {},
      };
      const run = sinon.stub(db, 'run');
      insertQuery(db);
      run.restore();
      sinon.assert.calledOnce(run);
      done();
    });

    it('updateQuery should call db.run once', (done) => {
      const db = {
        run: () => {},
      };
      const run = sinon.stub(db, 'run');
      updateQuery(db);
      run.restore();
      sinon.assert.calledOnce(run);
      done();
    });

    it('deleteQuery should call db.run once', (done) => {
      const db = {
        run: () => {},
      };
      const run = sinon.stub(db, 'run');
      deleteQuery(db);
      run.restore();
      sinon.assert.calledOnce(run);
      done();
    });
  });

  describe('Tests calling actual db', () => {
    before((done) => {
      db.serialize((err) => {
        if (err) {
          return done(err);
        }

        buildSchemas(db);

        done();
      });
    });

    it('selectQuery should throw an error with invalid query', async () => {
      try {
        await selectQuery(db, 'testtesttest');
        assert.fail('selectQuery should throw an error');
      } catch (error) {}
    });

    it('updateQuery should throw an error with invalid query', async () => {
      try {
        await updateQuery(db, 'testtesttest');
        assert.fail('updateQuery should throw an error');
      } catch (error) {}
    });

    it('deleteQuery should throw an error with invalid query', async () => {
      try {
        await deleteQuery(db, 'testtesttest');
        assert.fail('deleteQuery should throw an error');
      } catch (error) {}
    });

    it('insertQuery should throw an error with invalid query', async () => {
      try {
        await insertQuery(db, 'testtesttest');
        assert.fail('insertQuery should throw an error');
      } catch (error) {}
    });
  });
});

