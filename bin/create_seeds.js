#!/usr/bin/env node
const { addSeconds, subSeconds } = require('date-fns')

function createTextEmail (stmt, createdAt) {
  const subject = '一封长长的问候'
  const content = new Array(100).join( '这是一封来自小红的长长的问候。')
  stmt.run('小明', 'xiaoming@example.com', '小红', 'xiaohong@example.com', subject, 'text', content, createdAt)
}

function createTextEmailWithHtmlTags (stmt, createdAt) {
  const subject = '一封长长的问候（Text with html tags）'
  const leadingContent = '<p>如果你看到HTML标签，不应该感到奇怪。</p>'
  const mainContent = new Array(100).join('<p>这是一封来自小红的长长的问候。')
  const content = leadingContent + mainContent
  stmt.run('小明', 'xiaoming@example.com', '小红', 'xiaohong@example.com', subject, 'text', content, createdAt)
}

function createHtmlEmail (stmt, createdAt) {
  const subject = '一封长长的问候（HTML）'
  const leadingContent = '<p>你不应该看到任何的HTML标签。</p>'
  const mainContent = new Array(100).join('<p>这是一封来自小红的长长的问候。')
  const content = leadingContent + mainContent
  stmt.run('小明', 'xiaoming@example.com', '小红', 'xiaohong@example.com', subject, 'html', content, createdAt)
}

function createEmails (db) {
  const total = 10
  const stmt = db.prepare('INSERT INTO email(fromName, fromAddress, toName, toAddress, subject, type, content, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
  let createdAt = subSeconds(new Date(), total)

  for (var i = 1; i <= total; i++) {
    if (i % 3 == 1) {
      createTextEmail(stmt, createdAt)
    } else if (i % 3 == 2) {
      createTextEmailWithHtmlTags(stmt, createdAt)
    } else {
      createHtmlEmail(stmt, createdAt)
    }
    createdAt = addSeconds(createdAt, 1)
  }

  stmt.finalize()
}

function createMessages (db) {
  const total = 10
  const stmt = db.prepare('INSERT INTO message(toMobile, content, createdAt) VALUES (?, ?, ?)')
  let createdAt = subSeconds(new Date(), total)

  for (var i = 1; i <= total; i++) {
    const content = new Array(10).join('来自小红的简短的问候。')
    stmt.run('18900010002', content, createdAt)
    createdAt = addSeconds(createdAt, 1)
  }

  stmt.finalize()
}

module.exports = function(db) {
  createEmails(db)
  createMessages(db)
}
