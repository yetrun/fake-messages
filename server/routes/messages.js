const _ = require('lodash')
const express = require('express')
const { body, validationResult } = require('express-validator')
const MessageDao = require('../dao/message')
const websocket = require('../websocket')

const router = express.Router()

router.get('/', async function(req, res, next) {
  const from = parseInt(req.query.from || 1)
  const size = parseInt(req.query.size || 10)
  const filters = _.pick(req.query, ['toMobile', 'tags', 'createdAtFrom', 'createdAtTo'])
  const { messages, total } = await MessageDao.getAll({ from, size, ...filters })
  res.send({ messages, total })
})

router.get('/toMobiles', async function (req, res, next) {
  const { filter } = req.query
  const toMobiles = await MessageDao.getToMobiles({ filter })
  console.log('toMobiles', toMobiles)
  res.send({ toMobiles })
})

router.get('/tags', async function (req, res, next) {
  const tags = await MessageDao.getTags()
  res.send({ tags })
})

router.post('/', [
  body('message.toMobile').not().isEmpty(),
  body('message.content').not().isEmpty(),
  body('message.tags').isArray()
], async function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const messageParams = req.body.message
  const message = await MessageDao.create(messageParams)
  // TODO: WebSocket 似乎失效了
  res.status(201).send({ message })
  websocket.broadcast({
    event: 'NewMessage',
    data: message
  })
})

module.exports = router

