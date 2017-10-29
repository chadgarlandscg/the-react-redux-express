const bookshelf = require('../../db_bookshelf')

class AppUser extends bookshelf.Model {
    constructor(sqlTableEntry){
        super(sqlTableEntry)
        this.tableName = 'app_user'
    }
}

module.exports = AppUser
