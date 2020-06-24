const TemplateDAO = require('../dao/template')

exports.parseContent = async function (templateId, bindings) {
  const template = await TemplateDAO.find(templateId)
  const content = template.content.replace(/%{([^{}]+)}/g, function (_, variable) {
    return bindings[variable]
  })
  return { subject: template.subject, content, contentType: template.contentType }
}
