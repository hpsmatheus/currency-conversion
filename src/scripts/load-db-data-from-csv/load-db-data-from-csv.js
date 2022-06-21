require('dotenv').config();
const fs = require('fs');
const fastcsv = require('fast-csv');

const query = `INSERT INTO "businessEntity" (id, name, path, emissions) VALUES ($1, $2, $3, $4)`;

function getDbConnection() {
  const Pool = require('pg').Pool;
  return new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}
let stream = fs.createReadStream(`${__dirname}/data.csv`);
console.log('read file');
let csvData = [];
console.log('csvData = []');
let csvStream = fastcsv
  .parse()
  .on('data', function (data) {
    csvData.push(data);
  })
  .on('end', function () {
    csvData.shift();
    const db = getDbConnection();
    db.connect((err, client, done) => {
      if (err) throw err;
      try {
        csvData.forEach((row) => {
          const id = Number(row[0]);
          const name = row[1];
          const path = row[2];
          const emissions = row[3] === 'null' ? null : Number(row[3]);
          row = [id, name, path, emissions];
          client.query(query, row, (err, res) => {
            if (err) {
              console.log('error on row:', row, err.stack);
            } else {
              console.log('inserted ' + res.rowCount + ' row:', row);
            }
          });
        });
      } finally {
        done();
      }
    });
  });

stream.pipe(csvStream);
