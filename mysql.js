const mysql = require("promise-mysql");

module.exports = mysql.createConnection({
    user: 'root',
    password: 'root',
    database: 'loopback'
});
