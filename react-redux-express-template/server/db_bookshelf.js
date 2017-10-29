var knex = require('knex')({
    client: 'postgresql',
    connection: {
        host     : process.env.DB_HOST,
        port     : process.env.DB_PORT,
        user     : process.env.DB_USER,
        database : process.env.DB,
        charset  : process.env.DB_CHARSET
    }
});

var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('bookshelf-camelcase');
module.exports = bookshelf;
