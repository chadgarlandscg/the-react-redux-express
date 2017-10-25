const db = require('../../db')

utils = {
    formatNoSql: noSql => {
        const json = noSql.jsonData
        json.id = noSql.id
        return json
    }
}

queries = {
    createNoSqlQuery: "INSERT INTO nosql_table (json_data) VALUES ($1) RETURNING *;",
    getNoSqlQuery: "SELECT * FROM nosql_table WHERE id=$1;",
    updateNoSqlDetailsQuery: "UPDATE nosql_table SET json_data = json_data || $1 where id=$2 RETURNING *;"
}

/* Get NoSQL data by id. */
module.exports.getNoSql = id =>
    db
        .one(queries.getNoSqlQuery, [id])
        .then(utils.formatNoSql)

/* Create NoSQL data. */
module.exports.createNoSql = jsonData =>
    db
        .one(queries.createNoSqlQuery, [jsonData])
        .then(utils.formatNoSql)

/* Update NoSQL data. */
module.exports.updateNoSql = (jsonData, noSqlId) =>
    db
        .one(queries.updateNoSqlDetailsQuery, [jsonData, id])
        .then(utils.formatNoSql)