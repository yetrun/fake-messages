const knex = require('./knex')
const TagsDAO = require('./tags')

const findAll = async function () {
  const templates = await knex('templates')
  for (const template of templates) {
    template.tags = await TagsDAO.findOf('Template', template.id)
  }
  return { templates }
}

const find = async function (id) {
  const [template] = await knex('templates').where({ id: id })
  template.tags = await TagsDAO.findOf('Template', template.id)
  return template
}

const create = async function ({ tags = [], ...params }) {
  const [templateId] = await knex('templates').insert(params)
  await TagsDAO.saveOf(tags, 'Template', templateId)
  return await find(templateId, { tags })
}

const update = async function ( { id, tags, ...params }) {
  await knex('templates').where({ id }).update(params)
  await TagsDAO.saveOf(tags, 'Template', id)
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
