const express = require('express')
const router = express.Router()

router.get('/', function(_req, res) {
  res.end('Fake Message API')
})

router.use('/emails', require('./emails'))
router.use('/short_messages', require('./short_messages'))
router.use('/templates', require('./templates'))
router.use('/private_numbers/bindings', require('./private_number_bindings'))
router.use('/private_numbers/calls', require('./private_number_calls'))

module.exports = router
