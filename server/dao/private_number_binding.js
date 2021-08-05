const knex = require('./knex')

const all = async function () {
  const bindings = await knex('privateNumberBindings').select('*').orderBy('createdAt', 'desc')
  return {
    privateNumberBindings: bindings
  }
}

const one = async function (id) {
  return await knex('privateNumberBindings').where('id', id)
}

const create = async function (params) {
  const [id] = await knex('privateNumberBindings').insert(params)
  return one(id)
}

module.exports = {
  all,
  getAll: all,
  one,
  getOne: one,
  create
}
