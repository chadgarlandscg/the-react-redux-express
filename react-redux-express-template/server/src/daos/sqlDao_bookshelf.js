const SqlTable = require('../domains/SqlTable')

/* Get sql by id. */
module.exports.getSql = id => new SqlTable({id}).fetch()

/* Create or update sql. */
module.exports.createOrUpdateSql = tableEntry => tableEntry.save()