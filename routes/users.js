var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'test'
});

connection.connect();

/* GET users listing. */
router.get('/', function(req, res, next) {

    connection.query('SELECT * from user', function(err, rows, fields) {
        if (err) throw err;
        console.dir(rows);
    });
  res.send('respond with a resource');
});

module.exports = router;
