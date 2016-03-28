/*
 * the node server back-office is meant to be a REST API providing more or less raw access to database. First draft:
 * /REST/people                                       --> return meta structure and links to available data-queries
 * /REST/people/:attribute(?start=0&number=100)       --> return data relative to attribute (and age) with meta on
 *                                                        remaining items
 * Q? at this point, should the people/attribute query return raw lines or precalculated averages ? I think the data
 * volume is too large if not using pagination, however, paginated data are incomplete data, how can I provide average on
 * subset only. Espeically, I could add a bias in the SQL query (e.g. order by) that would cause data presented to be
 * incorrect.
 */
var fs, databasePath, express, server, people;
// Setup parameters
console.info(process.argv.join(', '));
if (process.argv.length > 2) {
  databasePath = process.argv[2];
}
fs = require('fs');
if (!fs.existsSync(databasePath)) {
  console.error('The database path does not exist:', databasePath);
  console.error('The server cannot start.');
  process.exit(-1);
}

console.info('Starting database');
people = require('./people')(databasePath);

console.info('prepare server...');
express = require('express');
server = express();
server.use('/', express.static('./front-office'));

console.info('Getting API ready');
server.get('/REST/people', people.meta);
server.get('/REST/people/:attribute', people.attribute);

server.listen(3000);
console.info('Server ready at http://localhost:3000');

var open = require('open');
open('http://localhost:3000');
