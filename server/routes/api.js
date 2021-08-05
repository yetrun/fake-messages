const express = require('express')
const router = express.Router()

router.get('/', function(req, res, next) {
  res.end('Fake Message API')
})

router.use('/emails', require('./emails'))
router.use('/messages', require('./messages'))
router.use('/templates', require('./templates'))
router.use('/private_numbers/bindings', require('./private_number_bindings'))

module.exports = router
