require('dotenv').config();
const { Pool } = require('pg');

function getDbConnection() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

const createTable =
  'CREATE TABLE IF NOT EXISTS "businessEntity" (\n' +
  '   id SERIAL PRIMARY KEY,\n' +
  '   name VARCHAR(100) not null,\n' +
  '   path VARCHAR(100) not null,\n' +
  '   emissions int\n' +
  ');';

const db = getDbConnection();
db.connect((err, client, done) => {
  if (err) throw err;
  try {
    client.query(createTable, null, (err) => {
      if (err) {
        console.log('error', err.stack);
      } else {
        console.log('executed with success');
      }
    });
  } finally {
    done();
  }
});
