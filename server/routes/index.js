var express = require('express');
var router = express.Router();

/* GET home page. */
// TODO: API 添加前缀
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
