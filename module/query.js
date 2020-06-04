// MYSQL connection
const mysql = require('mysql');
// MySQL Setup
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'mydb',
});

module.exports = db;