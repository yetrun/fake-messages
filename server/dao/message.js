const db = require('./db')

const getAllStatement = whereClause => db.prepare(`
  SELECT messages.*
  FROM messages
  LEFT JOIN tags on tags.targetType = 'Message' AND tags.targetId = messages.id
  ${whereClause}
  GROUP BY messages.id
  ORDER BY createdAt desc
  LIMIT @limit OFFSET @offset
`)
const getTotalStatement = whereClause => db.prepare(`
  SELECT count(*) as total
  FROM messages
  LEFT JOIN tags on tags.targetType = 'Message' AND tags.targetId = messages.id
  ${whereClause}
  GROUP BY messages.id
`)
const getOneStatement = db.prepare('SELECT * FROM messages WHERE id = ?')
const insertStatement = db.prepare('INSERT INTO messages(toMobile, content) VALUES (@toMobile, @content)')

const getTagsStatement = db.prepare(`SELECT * FROM tags WHERE targetType = "Message" and targetId = ?`)
const insertTagStatement = db.prepare(`INSERT INTO tags(name, targetType, targetId)
  VALUES (@name, 'Message', @targetId)`)

const getAll = db.transaction(({ from = 1, size = 10, ...filters }) => {
  const whereClause = buildWhereClause(filters)
  const messages = getAllStatement(whereClause).all({ ...filters, limit: size, offset: from - 1 })
  messages.forEach(message => message.tags = getTags(message.id))
  const { total } = getTotalStatement(whereClause).get(filters) || { total: 0 }
  return { messages, total }
})

const getOne = id => {
  const message = getOneStatement.get(id)
  message.tags = getTags(id)
  return message
}

const create = ({ tags = [], ...params }) => {
  const { lastInsertRowid: messageId } = insertStatement.run(params)
  insertTags(messageId, tags)
  return getOne(messageId)
}

function getTags (messageId) {
  return getTagsStatement.all(messageId).map(tag => tag.name)
}

function insertTags (messageId, tags) {
  for (const tag of tags) {
    insertTagStatement.run({ name: tag, targetId: messageId })
  }
}

function buildWhereClause (filters) {
  const whereConditions = []
  if (filters.toMobile) {
    whereConditions.push('messages.toMobile = @toMobile')
  }
  if (filters.tag) {
    whereConditions.push('tags.name = @tag')
  }
  return whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''
}

module.exports = {
  getAll,
  create
}

