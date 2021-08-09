const TagsDAO = require('../dao/tags')

module.exports = function (targetType) {
  return async function (_req, res) {
    const tags = await TagsDAO.findOf(targetType, { limit: 10 })
    res.send({ tags })
  }
}
