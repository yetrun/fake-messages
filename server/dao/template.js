const knex = require('./knex')

const findAll = async function () {
  const templates = await knex('templates')
  return { templates }
}

const find = async function (id) {
  const templates = await knex('templates').where({ id: id })
  return templates[0]
}

const create = async function (params) {
  const [templateId] = await knex('templates').insert(params)
  return await find(templateId)
}

const update = async function ( { id, ...params }) {
  await knex('templates').where({ id }).update(params)
  return await find(id)
}

const destroy = async function (id) {
  await knex('templates').where({ id: id }).del()
}

module.exports = {
  findAll,
  find,
  create,
  update,
  destroy
}
