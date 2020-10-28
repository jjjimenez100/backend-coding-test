const port = 8010;

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');
const buildSchemas = require('./src/schemas');
const logger = require('./src/lib/logger');

db.serialize(() => {
  buildSchemas(db);

  const app = require('./src/app')(db);
  app.listen(port, () => logger.info(`App started and listening on port ${port}`));
});
