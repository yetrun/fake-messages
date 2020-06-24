const _ = require('lodash')
const express = require('express')
const { body, validationResult } = require('express-validator')
const MessageDAO = require('../dao/message')
const TemplateDAO = require('../dao/template')
const TagsDAO = require('../dao/tags')
const websocket = require('../websocket')

const router = express.Router()

router.get('/', async function(req, res, next) {
  const from = parseInt(req.query.from || 1)
  const size = parseInt(req.query.size || 10)
  const filters = _.pick(req.query, ['toMobile', 'tags', 'createdAtFrom', 'createdAtTo'])
  const { messages, total } = await MessageDAO.getAll({ from, size, ...filters })
  res.send({ messages, total })
})

router.get('/toMobiles', async function (req, res, next) {
  const { filter } = req.query
  const toMobiles = await MessageDAO.getToMobiles({ filter })
  console.log('toMobiles', toMobiles)
  res.send({ toMobiles })
})

router.get('/tags', async function (req, res, next) {
  const tags = await TagsDAO.findOf('Message', { limit: 10 })
  res.send({ tags })
})

router.post('/send', [
  body('message.toMobile').not().isEmpty(),
  body('message.content').not().isEmpty(),
  body('message.tags').isArray()
], async function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const messageParams = req.body.message
  await sendMessage(messageParams, res)
})

router.post('/xsend', [
  body('message.toMobile').not().isEmpty(),
  body('message.tags').isArray(),
  body('message.templateId').not().isEmpty()
], async function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const messageParams = req.body.message
  const messageRealParams = {
    toMobile: messageParams.toMobile,
    tags: messageParams.tags,
    content: await parseContent(messageParams.templateId, messageParams.bindings)
  }
  await sendMessage(messageRealParams, res)
})

async function sendMessage (params, res) {
  const message = await MessageDAO.create(params)
  res.status(201).send({ message })
  websocket.broadcast({
    event: 'NewMessage',
    data: message
  })
}

async function parseContent (templateId, bindings) {
  const template = await TemplateDAO.find(templateId)
  return template.content.replace(/%{([^{}]+)}/g, function (_, variable) {
    return bindings[variable]
  })
}

module.exports = router
