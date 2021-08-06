const knex = require('./knex')

const all = async function ({
  currentPage = 1,
  perPage = 10
} = {
  currentPage: 1,
  perPage: 10
}) {
  const { data: privateNumberBindings, pagination } = await knex('privateNumberBindings').select('*').orderBy('createdAt', 'desc').paginate({ currentPage, perPage, isLengthAware: true })
  // TODO: 这里的分页返回用 pagination 对象
  return {
    privateNumberBindings,
    pagination
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
