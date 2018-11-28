var express = require('express');
var router = express.Router();

// GET /
router.get('/', (req, res, next) => {
  return res.render('index', { title: 'Home' });
});

// GET /signin
router.get('/signin', (req, res, next) => {
  return res.render('signin', { title: 'Sign In' });
});

// GET /signup
router.get('/signup', (req, res, next) => {
  return res.render('signup', { title: 'Sign Up' });
});

// POST /signup
router.post('/signup', (req, res, next) => {
    // todo
  return res.send('post request received!');
});

module.exports = router;
