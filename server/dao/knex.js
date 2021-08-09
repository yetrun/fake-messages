const { resolve } = require('path')
const knex = require('knex')({
  debug: process.env.NODE_ENV !== 'production',
  client: 'sqlite3',
  connection: {
    filename: resolve(__dirname, "../../db/default.sqlite3")
  },
  useNullAsDefault: true
})
const { attachPaginate } = require('knex-paginate')

attachPaginate()

module.exports = knex
