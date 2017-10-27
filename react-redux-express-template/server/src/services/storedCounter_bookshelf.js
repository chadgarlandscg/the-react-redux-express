const storedCounterDao_bookshelf = require('../daos/sqlDao_bookshelf')
const SqlTable = require('../domains/SqlTable')

module.exports.updateStoredCounter = (id, val) =>
    storedCounterDao_bookshelf.getSql(id)
        .then(storedCounter => {
            storedCounter.set({tableData: storedCounter.get('tableData') + val})
            return storedCounterDao_bookshelf.createOrUpdateSql(storedCounter)
        })

module.exports.createStoredCounter = init =>
    storedCounterDao_bookshelf.createOrUpdateSql(new SqlTable({
        tableData: init || 0
    }))

module.exports.getStoredCounter = id => storedCounterDao_bookshelf.getSql(id)