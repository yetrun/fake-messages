const _ = require('lodash')
const knex = require('./knex')

const saveOf = async function (tags, targetType, targetId) {
  await knex('tags').where({ targetType, targetId }).del()
  for (const tag of tags) {
    await knex('tags').insert({ name: tag, targetType, targetId })
  }
}

// 该函数有两种调用方式：
//
// findOf(targetType, id) => 返回单个记录
// findOf(targetType, options) => 返回多个记录
const findOf = async function (targetType, options) {
  const func = _.isNumber(options) ? findOneOf : findAllOf
  return await func(targetType, options)
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
