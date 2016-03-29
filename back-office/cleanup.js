var databasePath, fs, people;
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

console.info('Connecting to database');
people = require('./people')(databasePath);
people.cleanup(function(){
  console.log('cleaned up');
  process.exit(0);
});
