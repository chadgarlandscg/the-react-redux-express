var knex = require('knex')({
    client: 'postgresql',
    connection: {
        host     : 'localhost',
        port     : '5432',
        user     : 'scottgarland',
        database : 'postgres_db',
        charset  : 'utf8'
    }
});

var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('bookshelf-camelcase');
module.exports = bookshelf;
