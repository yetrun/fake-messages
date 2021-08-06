const express = require('express')
const { param, body } = require('express-validator')
const PrivateNumberBindingDAO = require('../dao/private_number_binding')

const router = express.Router()

router.get('/', async function(req, res, _next) {
  const currentPage = parseInt(req.query.page || '1')
  const perPage = parseInt(req.query.perPage || '10')
  
  const { privateNumberBindings, pagination } = await PrivateNumberBindingDAO.all({ currentPage, perPage })
  res.send({ privateNumberBindings, pagination })
})

router.get('/:id', [
  param('id').toInt()
], async function(req, res, _next) {
  const binding = await PrivateNumberBindingDAO.one(req.params.id)
  res.send({ privateNumberBinding: binding })
})

router.post('/', [
  body('privateNumberBinding.phoneNumberA').notEmpty(),
  body('privateNumberBinding.phoneNumberB').notEmpty()
], async function(req, res, _next) {
  const bindingParams = req.body.privateNumberBinding
  const virtualNumber = generateVirtualNumber(bindingParams.phoneNumberA, bindingParams.phoneNumberB)

  const binding = await PrivateNumberBindingDAO.create({ ...bindingParams, virtualNumber  })
  res.send({ privateNumberBinding: binding })
})

function generateVirtualNumber (phoneNumberA, phoneNumberB) {
  const cutNumberA = phoneNumberA.substr(0, 4).padStart(4, '0') 
  const cutNumberB = phoneNumberB.substr(0, 4).padStart(4, '0')
  const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(4, '0')
  return cutNumberA + cutNumberB + randomNumber
}

module.exports = router
