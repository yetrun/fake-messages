const express = require('express')
const TemplateDAO = require('../dao/template')

const router = express.Router()

router.get('/', async function(req, res, next) {
  const { templates } = await TemplateDAO.findAll()
  res.send({ templates })
})

module.exports = router
