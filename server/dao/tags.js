const _ = require('lodash')
const knex = require('./knex')

const saveOf = async function (tags, targetType, targetId) {
  await knex('tags').where({ targetType, targetId }).del()
  for (const tag of tags) {
    await knex('tags').insert({ name: tag, targetType, targetId })
  }
}

const findOf = async function (...params) {
  // TODO: 使用参数选择器
  if (_.isNumber(params[1])) {
    return await findOneOf(...params)
  } else {
    return await findAllOf(...params)
  }
}

async function findOneOf (targetType, targetId) {
  const tags = await knex('tags').where({ targetType, targetId })
  return tags.map(tag => tag.name)
}

async function findAllOf (targetType, { limit = 10 } = { limit: 10 }) {
  const tags = await knex('tags').distinct('name')
    .where('targetType', targetType)
    .limit(limit)
  return tags.map(tag => tag.name)
}

module.exports = {
  saveOf,
  findOf
}
