const storedCounterDao = require('../daos/sqlDao')
module.exports.createStoredCounter = init => storedCounterDao.createSql(init || 0)
module.exports.updateStoredCounter = (id, val) =>
    storedCounterDao.getSql(id)
        .then(storedCounter =>
            storedCounterDao.updateSql(storedCounter.tableData+val, id)
        )
module.exports.getStoredCounter = id => storedCounterDao.getSql(id)