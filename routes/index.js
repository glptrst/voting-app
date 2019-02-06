let express = require('express');
let router = express.Router();
let User = require('../models/user.js');
let Poll = require('../models/poll');
let mid = require('../middleware');

// GET /poll
router.get('/poll', (req, res, next) => {
    Poll.findOne({ title: req.query.title }, (err, poll) => {
	if (err) return next(err);
	return res.render('poll', {
	    pollTitle: poll.title,
	    pollOptions: poll.options,
	    pollAuthor: poll.author
	});
    });
});

// GET /polls_list
router.get('/polls_list', (req, res, next) => {
    Poll.find({}, (err, polls) => {
	if (err) return next(err);
	return res.render('polls_list', { title: 'Polls', polls: polls });
    });
});

// GET /
router.get('/', (req, res, next) => {
    if (req.session.userId)
	return res.redirect('/polls_list');
    else
	return res.render('index', { title: 'Home' });
});

// POST /createpoll
router.post('/createpoll', (req, res, next) => {
    let title = req.body.inputTitle;
    let options = req.body.inputOptions.split('\r\n').filter(a => a !== '');

    // 9 options limit
    if (options.length > 9) return next( new Error('Too many options! 9 is the limit') );

    // Get user
    User.findById(req.session.userId, (error, user) => {
	// Make string 'foo' into object {title: 'foo'}
	options = options.map(function(a){ return {title: a, votes: 0}; });

	// Create poll object to insert
	let poll = {
	    title: title,
	    author: user. username,
	    options: options
	};

	// Insert poll into db
	Poll.create(poll, (error, doc) => {
	    if (error) return next(error);
	    else       return res.redirect('polls_list');
	});
    });
});

// GET /createpoll
router.get('/createpoll', mid.requiresLogin, (req, res, next) => {
    return res.render('createPoll', { title: 'Create New Poll' });
});

// GET /profile
router.get('/profile', mid.requiresLogin, (req, res, next) => {
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
router.get('/signin', mid.loggedOut, (req, res, next) => {
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
router.get('/signup', mid.loggedOut, (req, res, next) => {
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
