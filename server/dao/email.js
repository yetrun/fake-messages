const knex = require('./knex')
const TagsDAO = require('./tags')

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
  // 这里不使用一条语句返回所有的 Email 和 Tags，而是使用 1+N 条语句。
  // 原因在于使用查询时，难以保留所有 Email 和 Tag 的记录。（避免出现 where tags.name = 'TAG1' 只出现 'TAG1' 的情况）

  let query
  if (tags) {
    query = knex('emails').select('emails.*')
      .leftJoin('tags', function () {
        this.on('tags.targetId', '=', 'emails.id')
      }) 
      .whereIn('tags.name', tags)
      .where('tags.targetType', 'Email')
      .groupBy('emails.id')
  } else {
    query = knex('emails').select('*')
  }

  if (fromAddress) query = query.where('emails.fromAddress', fromAddress)
  if (toAddress) query = query.where('emails.toAddress', toAddress)
  if (createdAtFrom) query = query.where('emails.createdAt', '>=', createdAtFrom)
  if (createdAtTo) query = query.where('emails.createdAt', '<=', createdAtTo)

  const { data: emails, pagination } = await query.orderBy('createdAt', 'desc')
    .paginate({ perPage: size, currentPage: Math.floor((from - 1) / 10) + 1, isLengthAware: true })
  await Promise.all(
    emails.map(email => {
      return TagsDAO.findOf('Email', email.id).then(tags => email.tags = tags)
    })
  )
  return { emails, total: pagination.total, pagination }
}

const getOne = async function (id) {
  const emails = await knex('emails').where('id', id)
  const email = emails[0]
  email.tags = await TagsDAO.findOf('Email', email.id)
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

module.exports = {
  getAll,
  getOne,
  create,
  getToAddresses,
  getFromAddresses
}
