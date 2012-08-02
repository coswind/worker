
/*
 * GET home page.
 */
var db = require('./../db.js'),
    pool = db.pool,
    fs = require('fs'); 

exports.crud = function(req, res) {
    var body = req.body;
    db.executeSql(body, function(err, rows) {
        res.end(JSON.stringify(arguments));
    });
};

exports.index = function(req, res) {
    res.sendfile('public/index.html');
};

exports.another = function(req, res) {
    res.sendfile('public/todos/index.html');
};

exports.upload = function(req, res) {
    var files = req.files;
    fs.renameSync(files.upload.path, 'public/pics/' + files.upload.name);
    res.end();
};

exports.all = function(req, res) {
    pool.acquire(function(err, db) {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            res.end();
        }
        db.query().select('*').from('wines').execute(function(err, rows, columns) {
            pool.release(db);
            res.end(JSON.stringify(rows));
        });
    });
};

exports.get = function(req, res) {
    var id = req.params.id;
    pool.acquire(function(err, db) {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            res.end();
        }
        db.query().select('*').from('wines').where('id=?', [id]).execute(function(err, rows, columns) {
            pool.release(db);
            res.end(JSON.stringify(rows[0]));
        });
    });
};

exports.post = function(req, res) {
    var json = req.body;
    pool.acquire(function(err, db) {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            res.end();
        }
        db.query()
        .insert('wines',
            ['name', 'grapes', 'country', 'region', 'year', 'description', 'picture'],
            [
                json.name,
                json.grapes,
                json.country,
                json.region,
                json.year,
                json.description,
                json.picture
            ]
        ).execute(function(err, rows, columns) {
            pool.release(db);
            res.end();
        });
    });
};

exports.delete = function(req, res) {
    var id = req.params.id;
    pool.acquire(function(err, db) {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            res.end();
        }
        db.query().delete().from('wines').where('id=?', [id]).execute(function(err, rows, columns) {
            pool.release(db);
            res.end();
        });
    });
};

exports.put = function(req, res) {
    var id = req.params.id;
    var json = req.body;
    pool.acquire(function(err, db) {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            res.end();
        }
        db.query().update('wines').set(json).where('id=?', [id]).execute(function(err, rows, columns) {
            pool.release(db);
            res.end();
        });
    });
};