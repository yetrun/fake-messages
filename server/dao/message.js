const _ = require('lodash')
const knex = require('./knex')
const TagsDAO = require('./tags')

const getAll = async function ({
  from = 1,
  size = 10,
  toMobile,
  createdAtFrom,
  createdAtTo,
  tags
} = {
  from: 1,
  size: 10
}) {
  let query // 返回所有字段，在应用层过滤字段的值
  if (tags) {
    query = knex('messages').select('messages.*')
      .leftJoin('tags', function () {
        this.on('tags.targetId', '=', 'messages.id')
      })
      .whereIn('tags.name', tags).where('tags.targetType', 'Message')
      .groupBy('messages.id')
  } else {
    query = knex('messages').select('*')
  }

  if (toMobile) query = query.where('messages.toMobile', toMobile)
  if (createdAtFrom) query = query.where('messages.createdAt', '>=', createdAtFrom)
  if (createdAtTo) query = query.where('messages.createdAt', '<=', createdAtTo)

  const { data: messages, pagination }= await query.orderBy('createdAt', 'desc')
    .paginate({ perPage: size, currentPage: Math.floor((from - 1) / 10) + 1, isLengthAware: true })
  await Promise.all(
    messages.map(message => { 
      return TagsDAO.findOf('Message', message.id).then(tags => message.tags = tags)
    })
  )
  return { messages, total: pagination.total, pagination }
}

const getOne = async function (id) {
  const messages = await knex('messages').where('id', id)
  const message = messages[0]
  message.tags = await TagsDAO.findOf('Message', id)
  return message
}

const create = async function ({ tags = [], ...params }) {
  const [messageId] = await knex('messages').insert(params)
  for (const tag of tags) {
    await knex('tags').insert({ name: tag, targetType: 'Message', targetId: messageId })
  }
  return getOne(messageId)
}

const getToMobiles = async function ({ filter }) {
  const messages = await knex('messages').select('toMobile')
    .where('toMobile', 'like', `%${filter}%`)
    .groupBy('toMobile')
    .orderBy('createdAt', 'desc')
    .limit(10)
  return messages.map(message => message.toMobile)
}

module.exports = {
  getAll,
  create,
  getToMobiles
}
