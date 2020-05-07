const mysql = require("mysql");

// var db = mysql.createPool({
//   host: "remotemysql.com",
//   user: "HGuWn1FHBN",
//   password: "5scuARnLmu",
//   database: "HGuWn1FHBN",
//   multipleStatements: true,
// });
var db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "rootpassword",
  database: "edunomics",
  multipleStatements: true,
});
db.query("select 1 + 1", (err, rows) => {
  /* */
  if (err) console.log(err);
  console.log(rows);
});
module.exports = db;
