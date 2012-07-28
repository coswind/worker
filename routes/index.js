
/*
 * GET home page.
 */
var db = require('./../db.js');

exports.crud = function(req, res) {
    var body = req.body;
    db.executeSql(body, function(err, rows) {
        res.end(JSON.stringify(arguments));
    });
};

exports.index = function(req, res) {
    res.sendfile('public/index.html');
};