var http = require('http'),
    mysql = require('db-mysql'),
    generic_pool = require('generic-pool');

var pool = generic_pool.Pool({
    name: 'mysql',
    max: 10,
    create: function(callback) {
        new mysql.Database({
            hostname: 'localhost',
            user: 'root',
            password: '111111',
            database: 'worker'
        }).connect(function(err, server) {
            callback(err, this);
        });
    },
    destroy: function(db) {
        db.disconnect();
    }
});

var attrs = [{
    value: 'id',
    type: 'Int'
}, {
    value: 'data',
    type: 'Char'
}];

(function() {
    var tmpObj = {};
    attrs.forEach(function(data) {
        var value = data.value,
            type = data.type;
        tmpObj[value] = value + ' = ?';
        tmpObj[value + '_ne'] = value + ' != ?';
        if (type == 'Int') {
            tmpObj[value + '_le'] = value + ' <= ?';
            tmpObj[value + '_ge'] = value + ' >= ?';
            tmpObj[value + '_lt'] = value + ' < ?';
            tmpObj[value + '_gt'] = value + ' > ?';
        } else if (type == 'Char') {
            tmpObj[value + '_like'] = value + ' LIKE ?';
        }
        tmpObj[value + '_in'] = value + ' IN ?';
    });
    attrs = tmpObj;
})();

var executeSql = function(opt) {
    var crud = opt.crud,
        table = opt.table,
        data = opt.data,
        range = opt.range,
        where = opt.where,
        order = opt.order;
    callback = arguments[arguments.length - 1] || function() {};
    pool.acquire(function(err, db) {
        if (err) {
            return callback(err);
        }

        var tmpDb = db.query();
        switch(crud) {
            case 'query':
                tmpDb = tmpDb.select(range).from(table);
                break;
            case 'insert':
                tmpDb = tmpDb.insert(table, data.name, data.value);
                break;
            case 'update':
                tmpDb = tmpDb.update(table).set(data);
                break;
            case 'delete':
                tmpDb = tmpDb.delete().from(table);
                break;
            default :
                break;
        }

        if (where) {
            var whereCond = [];
            where.attr.forEach(function(value) {
                if (value in attrs) {
                    whereCond.push(attrs[value]);
                }
            });
            whereCond = whereCond.join(' and ');
            tmpDb = tmpDb.where(whereCond, where.data);
        }

        if (order) {
            tmpDb = tmpDb.order(order);
        }

        tmpDb.execute(function(err, rows, columns) {
            pool.release(db);

            callback(err, rows, columns);
        });
    });
};

exports.executeSql = executeSql;
