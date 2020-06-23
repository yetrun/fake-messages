const express = require('express')
const router = express.Router()

/* GET home page writen as vue spa. */
// TODO: 现在找到一个挂在 API 锚点下的理由，404 路由的时候可以返回格式友好的 JSON.
router.get('/', function(req, res, next) {
  res.render('index')
})

module.exports = router
