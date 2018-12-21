let express = require('express');
let router = express.Router();
let User = require('../models/user.js');

// GET /
router.get('/', (req, res, next) => {
    return res.render('index', { title: 'Home' });
});

// GET /profile
router.get('/profile', (req, res, next) => {
    User.findById(req.session.userId).exec((error, user) => {
	if (error)
	    return next(error);
	else
            return res.render('profile', { title: 'Profile', username: user.username, email: user.email });
    });
});

// GET /signout
router.get('/signout', (req, res, next) => {
    if (req.session) {
	req.session.destroy(err => {
	    if (err)
		return next(err);
	    else
		return res.redirect('/');
	});
    }
});

// GET /signin
router.get('/signin', (req, res, next) => {
    return res.render('signin', { title: 'Sign In' });
});

// POST /signin
router.post('/signin', (req, res, next) => {
    if (req.body.inputEmail && req.body.inputPassword) {
	User.authenticate(req.body.inputEmail, req.body.inputPassword, (error, user) => {
	    if (error || !user) {
		let err = new Error('Wrong email or password.');
		err.status = 401;
		return next(err);
	    } else {
		req.session.userId = user._id;
		return res.redirect('/profile');
	    }
	});
    } else {
	let err = new Error('Email and password are required to sign in...');
	err.status = 401;
	return next(err);
    }
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
	    
	    // use schema's `create` method to insert document into Mongo
    	    User.create(userData, (err, user) => {
    		if (err)
    		    return next(err);
    		else {
		    req.session.userId = user._id;
    		    return res.redirect('/profile');
		}
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
