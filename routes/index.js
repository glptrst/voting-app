var express = require('express');
var router = express.Router();

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /signin
router.get('/signin', function(req, res, next) {
  return res.render('signin', { title: 'Sign In' });
});

// GET /signup


module.exports = router;
