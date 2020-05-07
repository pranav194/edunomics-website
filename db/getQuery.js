const db = require("./db");
const getQuery = (query) => {
  console.log(query);
  return new Promise((resolve, reject) => {
    db.query(query, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

module.exports = getQuery;
