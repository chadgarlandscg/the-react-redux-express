const db = require('../../db')

const queries = {
    createSqlQuery: "INSERT INTO sql_table (table_data, userId) VALUES ($1, $2) RETURNING *;",
    getSqlQuery: "SELECT * FROM sql_table WHERE id=$1;",
    updateSqlQuery: "UPDATE sql_table SET table_data=$1 WHERE id=$2 RETURNING *;",
}

/* Get sql by id. */
module.exports.getSql = id => db.one(queries.getSqlQuery, [id])

/* Create sql. */
module.exports.createSql = entry => db.one(queries.createSqlQuery, [entry.init, entry.userId])

/* Update sql. */
module.exports.updateSql = (tableData, id) => db.one(queries.updateSqlQuery, [tableData, id])