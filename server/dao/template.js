const knex = require('./knex')

const findAll = async function () {
  const templates = await knex('templates')
  return { templates }
}

const create = async function (params) {
  const [templateId] = await knex('templates').insert(params)
  return await find(templateId)
}

const find = async function (id) {
  const templates = await knex('templates').where({ id: id })
  return templates[0]
}

module.exports = {
  findAll,
  find,
  create
}
