
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
        db.query().select('*').from('user').execute(function(err, rows, columns) {
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
        db.query().select('*').from('user').where('id=?', [id]).execute(function(err, rows, columns) {
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
        .insert('user',
            ['name', 'username', 'password', 'phone', 'address', 'type', 'introduce', 'picture'],
            [
                json.name,
                json.username || 'coswind',
                json.password || '111111',
                json.phone,
                json.address,
                json.type,
                json.introduce,
                json.picture
            ]
        ).execute(function(err, rows, columns) {
            console.log(err);
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
        db.query().delete().from('user').where('id=?', [id]).execute(function(err, rows, columns) {
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
        db.query().update('user').set(json).where('id=?', [id]).execute(function(err, rows, columns) {
            pool.release(db);
            res.end();
        });
    });
};