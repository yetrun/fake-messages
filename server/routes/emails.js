const _ = require('lodash')
const express = require('express')
const { body, validationResult } = require('express-validator')
const EmailDao = require('../dao/email')
const websocket = require('../websocket')
const { stripHTMLTags } = require('../../lib/htmltools')
const { parseContent } = require('../helpers/template')

const router = express.Router()

router.get('/', async function(req, res) {
  const from = parseInt(req.query.from || 1)
  const size = parseInt(req.query.size || 10)
  const filters = _.pick(req.query, ['fromAddress', 'toAddress', 'tags', 'createdAtFrom', 'createdAtTo'])
  const { emails, total } = await EmailDao.getAll({ from, size, ...filters })
  simplifyContent(emails)
  res.send({ emails, total })
})

router.get('/fromAddresses', async function (req, res) {
  const { filter } = req.query
  const fromAddresses = await EmailDao.getFromAddresses({ filter })
  res.send({ fromAddresses })
})

router.get('/toAddresses', async function (req, res) {
  const { filter } = req.query
  const toAddresses = await EmailDao.getToAddresses({ filter })
  res.send({ toAddresses })
})

router.get('/:id', async function(req, res) {
  const { id } = req.params
  const email = await EmailDao.getOne(id)
  res.send({ email })
})

router.post('/send', [
  body('email.toAddress').not().isEmpty(),
  body('email.fromAddress').not().isEmpty(),
  body('email.subject').not().isEmpty(),
  body('email.content').not().isEmpty(),
  body('email.tags').optional().isArray()
], async function(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const emailParams = req.body.email
  const email = await EmailDao.create(emailParams)
  res.status(201).send({ email })
  websocket.broadcast({
    event: 'NewEmail',
    data: email
  })
})

router.post('/xsend', [
  body('email.toAddress').not().isEmpty(),
  body('email.fromAddress').not().isEmpty(),
  body('email.templateId').not().isEmpty(),
  body('email.tags').isArray()
], async function(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const emailParams = _.pick(req.body.email, ['toAddress', 'toName', 'fromAddress', 'fromName', 'tags', 'subject'])
  const { templateId, bindings } = req.body.email
  const { subject, content, contentType } = await parseContent(templateId, bindings)
  emailParams.content = content
  emailParams.type = contentType
  if (!emailParams.subject) emailParams.subject = subject

  const email = await EmailDao.create(emailParams)
  res.status(201).send({ email })
  websocket.broadcast({
    event: 'NewEmail',
    data: email
  })
})

function simplifyContent (emails) {
  emails.forEach(email => {
    if (email.type === 'text') {
      email.content = email.content.substr(0, 80)
    } else if (email.type === 'html') {
      email.content = stripHTMLTags(email.content).substr(0, 80)
    }
  })
}

module.exports = router
