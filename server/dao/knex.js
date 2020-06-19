const knex = require('knex')({
  debug: true,
  client: 'sqlite3',
  connection: {
    filename: "db/default.sqlite3"
  }
})
const { attachPaginate } = require('knex-paginate')
attachPaginate()
module.exports = knex
