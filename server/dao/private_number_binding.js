const knex = require('./knex')

const all = async function ({
  currentPage = 1,
  perPage = 10
} = {
  currentPage: 1,
  perPage: 10
}) {
  const { data: privateNumberBindings, pagination } = await knex('privateNumberBindings').select('*').orderBy('createdAt', 'desc').paginate({ currentPage, perPage, isLengthAware: true })
  return {
    privateNumberBindings,
    pagination
  }
}

const one = async function (id) {
  const privateNumberBindings = await knex('privateNumberBindings').where('id', id)
  return privateNumberBindings[0]
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
