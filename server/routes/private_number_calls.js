const { addSeconds } = require('date-fns')
const express = require('express')
const { body, query, validationResult } = require('express-validator')
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

module.exports = router
