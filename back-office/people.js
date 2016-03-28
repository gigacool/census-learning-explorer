var sqlite3 = require('sqlite3').verbose();
// FIXME set db as an external parameter
// TODO cleanup db to remove empty rows or skip them in queries

var conversionMap = {
  "varchar(1000)": "string",
  "int": 'int'
};

module.exports = function(databasePath) {
  var db = new sqlite3.Database(databasePath);
  return {
    // cleanup:function(callback){
    //   db.serialize(function(){
    //     db.each('SELECT count(age) FROM census_learn_sql WHERE age IS NULL;', function(err, row){
    //       if (row['cound(age)'] !== 0){
    //
    //       }
    //     }, function(){
    //       callback();
    //     });
    //   });
    // },
    /* returns data meta data */
    meta: function(request, response) {
      var result = {
        data: []
      };
      db.serialize(function() {
        db.each("pragma table_info(census_learn_sql);", function(err, row) {
          // here, we transform a bit the data toward a more applicative usage
          result.data.push({
            id: row.cid,
            href: '/REST/people/' + encodeURIComponent(row.name),
            name: row.name,
            type: conversionMap[row.type]
          });
        }, function() {
          response.send(result);
        });
      });
    },
    /* returns the applicative data for a given attribute*/
    attribute: function(request, response) {
      // FIXME is decodeURIComponent enough to prevent sql injection ?
      var columnHeader = decodeURIComponent(request.params.attribute);
      var map = {};
      var result = {
        attribute: columnHeader,
        data: []
      };
      db.serialize(function() {
        var query = "SELECT age,\"" + columnHeader + "\" FROM census_learn_sql;";
        db.each(query, function(err, row) {
          var localMap = map[row[columnHeader]];
          if (!localMap) {
            localMap = {
              value: row[columnHeader],
              ages: []
            };
            map[row[columnHeader]] = localMap;
          }
          localMap.ages.push(row.age);
        }, function() {
          for (var key in map) {
            if ({}.hasOwnProperty.call(map, key)) {
              result.data.push(map[key]);
            }
          }
          response.send(result);
        });
      });
    }
  };
};
