const axios = require('axios')
const { addSeconds } = require('date-fns')
const express = require('express')
const { body, param, query, validationResult } = require('express-validator')
const PrivateNumberCallDAO = require('../dao/private_number_call')

const router = express.Router()

router.get('/', [
  query('bindingId').notEmpty().toInt()
], async function(req, res, _next) {
  const { privateNumberCalls } = await PrivateNumberCallDAO.all({ bindingId: req.query.bindingId })
  res.send({ privateNumberCalls })
})

router.post('/', [
  body('call.bindingId').notEmpty(),
  body('call.fromPhoneNumber').notEmpty(),
  body('call.toPhoneNumber').notEmpty(),
  body('call.virtualNumber').notEmpty(),
  body('call.callingAt').notEmpty().toDate(),
  body('call.connectedAt').notEmpty().toDate(),
  body('call.hungUpAt').notEmpty().toDate()
], async function(req, res, _next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const callParams = req.body.call
  const call = await PrivateNumberCallDAO.create(callParams)
  res.status(201).send({ call })

  // websocket.broadcast({
  //   event: 'NewEmail',
  //   data: email
  // })
})

router.post('/:id/push', [
  param('id').toInt(),
  body('pushUrl').notEmpty()
], async function(req, res, _next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const call = await PrivateNumberCallDAO.one(req.params.id)

  // 向 pushUrl 推送 call 数据
  try {
    await axios.post(req.body.pushUrl, { privateNumberCall: call })
    res.status(200).send({ message: '推送成功' })
  } catch (err) {
    res.status(500).send({ message: '推送失败' })
  }
})

module.exports = router
