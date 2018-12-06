let express = require('express');
let router = express.Router();
let User = require('../models/user');

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
    if (req.body.inputUsername && req.body.inputEmail &&
    	req.body.inputPassword && req.body.inputConfirmPassword)
    {
    	if (req.body.inputPassword === req.body.inputConfirmPassword) {

    	    let userData = {
    		username: req.body.inputUsername,
    		email: req.body.inputEmail,
    		password: req.body.inputPassword
    	    };
	    
    	    User.create(userData, (err, user) => {
    		if (err)
    		    return next(err);
    		else
    		    return res.redirect('/');
		    
    	    });

    	} else {
    	    let err = new Error('Passwords do not match');
    	    err.status = 400;
    	    return next(err);
    	}
    } else {
    	let err = new Error('All fields required');
    	err.status = 400;
    	return next(err);
    }
});

module.exports = router;
