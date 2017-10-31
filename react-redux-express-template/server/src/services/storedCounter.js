const storedCounterDao = require('../daos/sqlDao')
module.exports.createStoredCounter = counter => storedCounterDao.createSql(counter)
module.exports.updateStoredCounter = (id, val) =>
    storedCounterDao.getSql(id)
        .then(storedCounter =>
            storedCounterDao.updateSql(storedCounter.tableData+val, id)
        )
module.exports.getStoredCounter = id => storedCounterDao.getSql(id)