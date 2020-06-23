const _ = require('lodash')
const express = require('express')
const { body, validationResult } = require('express-validator')
const TemplateDAO = require('../dao/template')

const router = express.Router()

router.get('/', async function(req, res, next) {
  const { templates } = await TemplateDAO.findAll()
  res.send({ templates })
})

router.post('/', [
  body('template.name').not().isEmpty(),
  body('template.content').not().isEmpty()
], async function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const templateParams = _.pick(req.body.template, ['name', 'content'])
  const template = await TemplateDAO.create(templateParams)
  res.send({ template })
})

router.put('/:id', [
  body('template.name').not().isEmpty(),
  body('template.content').not().isEmpty()
], async function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const templateParams = _.pick(req.body.template, ['name', 'content'])
  templateParams.id = req.params.id
  const template = await TemplateDAO.update(templateParams)
  res.send({ template })
})

router.delete('/:id', async function (req, res, next) {
  const templateId = req.params.id
  await TemplateDAO.destroy(templateId)
  res.end()
})

module.exports = router
