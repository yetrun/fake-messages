const _ = require('lodash')
const express = require('express')
const PrivateNumberBindingDAO = require('../dao/private_number_binding')

const router = express.Router()

router.get('/', async function(req, res, next) {
  const { privateNumberBindings } = await PrivateNumberBindingDAO.all()
  res.send({ privateNumberBindings, total: 10 })
})

module.exports = router
