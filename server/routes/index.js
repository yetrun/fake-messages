const express = require('express')
const router = express.Router()

/* GET home page writen as vue spa. */
router.get('/', function(req, res, next) {
  res.render('index')
})

module.exports = router
