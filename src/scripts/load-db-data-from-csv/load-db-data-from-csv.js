require('dotenv').config();
const fs = require('fs');
const fastcsv = require('fast-csv');
const { Pool } = require('pg');

let stream = fs.createReadStream(`${__dirname}/data.csv`);
let businessEntities = [];

let csvStream = fastcsv
  .parse()
  .on('data', function (businessEntityRow) {
    businessEntities.push(businessEntityRow);
  })
  .on('end', function () {
    businessEntities.shift();
    const db = getDbConnection();
    db.connect((err, client, done) => {
      if (err) throw err;
      try {
        businessEntities.forEach((row) => {
          insertRowOnDataBase(row, client);
        });
      } finally {
        done();
      }
    });
  });

function getDbConnection() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

function insertRowOnDataBase(row, client) {
  const insertQuery = `INSERT INTO "businessEntity" (id, name, path, emissions) VALUES ($1, $2, $3, $4)`;
  row = typeRowData(row);
  client.query(insertQuery, row, (err) => {
    if (err) {
      console.log('error inserting row:', row, err.stack);
    } else {
      console.log('inserted row:', row);
    }
  });
}

function typeRowData(row) {
  const id = Number(row[0]);
  const name = row[1];
  const path = row[2];
  const emissions = row[3] === 'null' ? null : Number(row[3]);
  return [id, name, path, emissions];
}

stream.pipe(csvStream);
