const express = require('express')
const PrivateNumberBindingDAO = require('../dao/private_number_binding')

const router = express.Router()

router.get('/', async function(req, res, next) {
  const currentPage = parseInt(req.query.page || '1')
  const perPage = parseInt(req.query.perPage || '10')
  
  const { privateNumberBindings, pagination } = await PrivateNumberBindingDAO.all({ currentPage, perPage })
  res.send({ privateNumberBindings, total: pagination.total, pagination })
})

module.exports = router
