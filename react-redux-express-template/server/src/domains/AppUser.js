const bookshelf = require('../../db_bookshelf')
const SqlTable = require('./SqlTable')

class AppUser extends bookshelf.Model {
    constructor(appUser){
        super(appUser)
        this.tableName = 'app_user'
    }
    sqlTable(){
        return this.hasOne(SqlTable)
    }
}

module.exports = AppUser
