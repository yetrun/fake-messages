const knex = require('./knex')

const findAll = async function () {
  const templates = await knex('templates')
  for (const template of templates) {
    template.tags = await getTagsOfTemplate(template.id)
  }
  return { templates }
}

const find = async function (id) {
  const [template] = await knex('templates').where({ id: id })
  template.tags = await getTagsOfTemplate(template.id)
  return template
}

const create = async function ({ tags = [], ...params }) {
  const [templateId] = await knex('templates').insert(params)
  // TODO: 创建标签可封装为方法
  for (const tag of tags) {
    await knex('tags').insert({ name: tag, targetType: 'Template', targetId: templateId})
  }
  return await find(templateId)
}

const update = async function ( { id, tags, ...params }) {
  await knex('templates').where({ id }).update(params)
  if (tags) {
    await knex('tags').where({ targetType: 'Template', targetId: id }).del()
    for (const tag of tags) {
      await knex('tags').insert({ name: tag, targetType: 'Template', targetId: id })
    }
  }
  return await find(id)
}

const destroy = async function (id) {
  await knex('templates').where({ id: id }).del()
}

async function getTagsOfTemplate (templateId) {
  const tags = await knex('tags').distinct('name')
    .where({
      targetType: 'Template',
      targetId: templateId
    })
  return tags.map(tag => tag.name)
}

module.exports = {
  findAll,
  find,
  create,
  update,
  destroy
}
