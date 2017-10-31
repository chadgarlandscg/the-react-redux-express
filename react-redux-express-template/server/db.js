require('dotenv').config()
const options = {
    receive: function (data /* , result, e */) {
        camelizeColumnNames(data);
    }
};
const humps = require('humps');
const pgp = require("pg-promise")(options);
module.exports = pgp({
    host: process.env.DB_HOST,
    database: process.env.DB,
    poolSize: process.env.POOL_SIZE // max number of clients in pool
})

function camelizeColumnNames(data) {
    var template = data[0];
    for (var prop in template) {
        var camel = humps.camelize(prop);
        if (!(camel in template)) {
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                d[camel] = d[prop];
                delete d[prop];
            }
        }
    }
}