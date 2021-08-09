const _ = require('lodash')
const express = require('express')
const { body, validationResult, matchedData } = require('express-validator')
const TemplateDAO = require('../dao/template')

const router = express.Router()
const validateBody = [
  body('template.name').notEmpty(),
  body('template.category'),
  body('template.subject'),
  body('template.content').notEmpty(),
  body('template.contentType'),
  body('template.tags').isArray()
]

router.get('/', async function(_req, res) {
  const { templates } = await TemplateDAO.findAll()
  res.send({ templates })
})

router.post('/', validateBody, async function(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const templateParams = matchedData(req).template
  const template = await TemplateDAO.create(templateParams)
  res.status(201).send({ template })
})

router.put('/:id', validateBody, async function(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const templateId = req.params.id
  const templateParams = matchedData(req).template
  const template = await TemplateDAO.update({ id: templateId, ...templateParams })
  res.send({ template })
})

router.delete('/:id', async function (req, res) {
  const templateId = req.params.id
  await TemplateDAO.destroy(templateId)
  res.end()
})

module.exports = router
