const _ = require('lodash')
const knex = require('knex')({
  debug: true,
  client: 'sqlite3',
  connection: {
    filename: "db/default.sqlite3"
  }
})
const { attachPaginate } = require('knex-paginate')
attachPaginate()

// TODO: 同时返回所有 tags
const getAll = async function ({
  fromAddress,
  toAddress,
  createdAtFrom,
  createdAtTo,
  tags,
  from = 1,
  size = 10
} = {
  from: 1,
  size: 10
}) {
  if (tags) {
    let query = knex().select('emails.*').from('emails').leftJoin('tags', function () {
      this.on('tags.targetId', '=', 'emails.id')
    }) // 返回所有字段，在应用层过滤字段的值
    if (fromAddress) query = query.where('emails.fromAddress', fromAddress)
    if (toAddress) query = query.where('emails.toAddress', toAddress)
    if (createdAtFrom) query = query.where('emails.createdAt', '>=', createdAtFrom)
    if (createdAtTo) query = query.where('emails.createdAt', '<=', createdAtTo)
    query = query.whereIn('tags.name', tags).where('tags.targetType', 'Email')
    const result = await query
      .groupBy('emails.id')
      .orderBy('createdAt', 'desc')
      .paginate({ perPage: size, currentPage: Math.floor((from - 1) / 10) + 1, isLengthAware: true })
    const { data: emails, pagination } = result
    await Promise.all(
      emails.map(email => { return getTagsOfEmail(email.id).then(tags => email.tags = tags) })
    )
    return { emails, total: pagination.total, pagination }
  } else {
    let query = knex('emails').select('*') // 返回所有字段，在应用层过滤字段的值
    if (fromAddress) query = query.where('fromAddress', fromAddress)
    if (toAddress) query = query.where('toAddress', toAddress)
    if (createdAtFrom) query = query.where('createdAt', '>=', createdAtFrom)
    if (createdAtTo) query = query.where('createdAt', '<=', createdAtTo)
    const result = await query.orderBy('createdAt', 'desc')
      .paginate({ perPage: size, currentPage: Math.floor((from - 1) / 10) + 1, isLengthAware: true })
    const { data: emails, pagination } = result
    await Promise.all(
      emails.map(email => { return getTagsOfEmail(email.id).then(tags => email.tags = tags) })
    )
    return { emails, total: pagination.total, pagination }
  }
}

const getOne = async function (id) {
  const emails = await knex('emails').where('id', id)
  const email = emails[0]
  email.tags = await getTagsOfEmail(id)
  return email
}

const create = async function ({ tags = [], ...params }) {
  const [emailId] = await knex('emails').insert(params)
  for (const tag of tags) {
    await knex('tags').insert({ name: tag, targetType: 'Email', targetId: emailId })
  }
  return getOne(emailId)
}

const getFromAddresses = async function ({ filter }) {
  const emails = await knex('emails').select('fromAddress')
    .where('fromAddress', 'like', `%${filter}%`)
    .groupBy('fromAddress')
    .orderBy('createdAt', 'desc')
    .limit(10)
  return emails.map(email => email.fromAddress)
}

const getToAddresses = async function ({ filter }) {
  const emails = await knex('emails').select('toAddress')
    .where('toAddress', 'like', `%${filter}%`)
    .groupBy('toAddress')
    .orderBy('createdAt', 'desc')
    .limit(10)
  return emails.map(email => email.toAddress)
}

const getTags = async function () {
  const tags = await knex('tags').distinct('name')
    .where('targetType', 'Email')
    .limit(10)
  return tags.map(tag => tag.name)
}

async function getTagsOfEmail (emailId) {
  const tags = await knex('tags').distinct('name')
    .where({
      targetType: 'Email',
      targetId: emailId
    })
  return tags.map(tag => tag.name)
}

module.exports = {
  getAll,
  getOne,
  create,
  getToAddresses,
  getFromAddresses,
  getTags
}
