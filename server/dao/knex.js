const { resolve } = require('path')
console.log(resolve(__dirname, "../../db/default.sqlite3"))
const knex = require('knex')({
  // debug: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
  debug: true,
  client: 'sqlite3',
  connection: {
    filename: resolve(__dirname, "../../db/default.sqlite3")
  },
  useNullAsDefault: true
})
const { attachPaginate } = require('knex-paginate')
attachPaginate()
module.exports = knex
