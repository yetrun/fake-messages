const db = require('./db')

const getAllStatement = whereClause => db.prepare(`
  SELECT emails.*
  FROM emails
  LEFT JOIN tags on tags.targetType = 'Email' AND tags.targetId = emails.id
  ${whereClause}
  GROUP BY emails.id
  ORDER BY createdAt desc
  LIMIT @limit OFFSET @offset
`)
const getTotalStatement = whereClause => db.prepare(`
  SELECT count(*) as total
  FROM emails
  LEFT JOIN tags on tags.targetType = 'Email' AND tags.targetId = emails.id
  ${whereClause}
  GROUP BY emails.id
`)
const getOneStatement = db.prepare('SELECT * FROM emails WHERE id = ?')
const insertStatement = db.prepare(`INSERT INTO emails(fromName, fromAddress, toName, toAddress, subject, type, content)
  VALUES (@fromName, @fromAddress, @toName, @toAddress, @subject, @type, @content)`)

const getTagsStatement = db.prepare(`SELECT * FROM tags WHERE targetType = "Email" and targetId = ?`)
const insertTagStatement = db.prepare(`INSERT INTO tags(name, targetType, targetId)
  VALUES (@name, 'Email', @targetId)`)

const getAll = db.transaction(({ from = 1, size = 10, ...filters }) => {
  const whereClause = buildWhereClause(filters)
  const emails = getAllStatement(whereClause).all({ ...filters, limit: size, offset: from - 1 })
  for (const email of emails) {
    email.tags = getTags(email.id)
  }
  const { total } = getTotalStatement(whereClause).get(filters) || { total: 0 }
  return { emails, total }
})

const getOne = db.transaction(id => {
  const email = getOneStatement.get(id)
  email.tags = getTags(id)
  return email
})

const create = db.transaction(({ tags = [], ...params }) => {
  const { lastInsertRowid: emailId } = insertStatement.run(params)
  insertTags(emailId, tags)
  return getOne(emailId)
})

function getTags (emailId) {
  return getTagsStatement.all(emailId).map(tag => tag.name)
}

function insertTags (emailId, tags) {
  for (const tag of tags) {
    insertTagStatement.run({ name: tag, targetId: emailId })
  }
}

function buildWhereClause (filters) {
  const whereConditions = []
  if (filters.fromAddress) {
    whereConditions.push('emails.fromAddress = @fromAddress')
  }
  if (filters.toAddress) {
    whereConditions.push('emails.toAddress = @toAddress')
  }
  if (filters.tag) {
    whereConditions.push('tags.name = @tag')
  }
  return whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''
}

module.exports = {
  getAll,
  getOne,
  create
}

