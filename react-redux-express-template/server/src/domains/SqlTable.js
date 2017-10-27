const bookshelf = require('../../db_bookshelf')

class SqlTable extends bookshelf.Model {
    constructor(sqlTableEntry){
        super(sqlTableEntry)
        this.tableName = 'sql_table'
    }
}

module.exports = SqlTable
