const knex = require('./knex')

const all = async function ({ bindingId }) {
  const privateNumberCalls = await knex('privateNumberCalls').select('*').where('privateNumberCalls.bindingId', bindingId)
  return { privateNumberCalls }
}

const one = async function (id) {
  const privateNumberCalls = await knex('privateNumberCalls').where('id', id)
  return privateNumberCalls[0]
}

const create = async function (params) {
  const [id] = await knex('privateNumberCalls').insert(params)
  return one(id)
}

module.exports = {
  all,
  getAll: all,
  one,
  getOne: one,
  create
}
