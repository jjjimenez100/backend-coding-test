const selectQuery = (db, query = '', values = []) => {
  const results = [];

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.each(query, values, (err, row) => {
        if (err) {
          return reject(err);
        }
        results.push(row);
      }, (accumulatedValuesErr, count) => {
        if (accumulatedValuesErr) {
          return reject(accumulatedValuesErr);
        }

        return resolve({ results, count });
      });
    });
  });
};

const insertQuery = (db, query = '', values = []) => new Promise((resolve, reject) => {
  // eslint-disable-next-line prefer-arrow-callback
  db.run(query, values, function (insertErr) {
    if (insertErr) {
      return reject(insertErr);
    }
    resolve(this.lastID);
  });
});

const deleteQuery = (db, query = '', values = []) => new Promise((resolve, reject) => {
  // eslint-disable-next-line prefer-arrow-callback
  db.run(query, values, function (deleteErr) {
    if (deleteErr) {
      return reject(deleteErr);
    }
    resolve();
  });
});

const updateQuery = (db, query = '', values = []) => new Promise((resolve, reject) => {
  // eslint-disable-next-line prefer-arrow-callback
  db.run(query, values, function (updateErr) {
    if (updateErr) {
      return reject(updateErr);
    }
    resolve(this.changes);
  });
});

module.exports = {
  selectQuery,
  insertQuery,
  deleteQuery,
  updateQuery,
};
