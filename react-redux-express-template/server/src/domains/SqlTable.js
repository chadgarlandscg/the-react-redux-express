const bookshelf = require('../../db_bookshelf')
const AppUser = require('./AppUser')

class SqlTable extends bookshelf.Model {
    constructor(sqlTableEntry){
        super(sqlTableEntry)
        this.tableName = 'sql_table'
    }
    appUser(){
        return this.belongsTo(AppUser)
    }
}

module.exports = SqlTable
