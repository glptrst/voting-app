let express = require('express');
let router = express.Router();
let User = require('../models/user.js');
let Poll = require('../models/poll');
let mid = require('../middleware');
let bcrypt = require('bcrypt');

// POST /poll
router.post('/poll', (req, res, next) => {
    let pollTitle = req.body.option.split('<++>')[0]; 
    let optionTitle = req.body.option.split('<++>')[1]; 

    // check if user has already voted for this poll
    User.findById(req.session.userId, function(error, user) {
	if (error) {
	    return next(error);
	} else {
	    if (user.pollsHasParticipatedIn.filter(poll => poll.title === pollTitle).length !== 0) {
		let err = new Error('You can vote only once in a poll!');
		err.status = 403;
		return next(err);
	    } else {
		user.pollsHasParticipatedIn.push( {title: pollTitle, vote: optionTitle} );
		user.save();

		// add vote to db
		Poll.findOne({title: pollTitle}, function(err, poll) {
		    if (err) {
			return next(err);
		    }
		    poll.options.forEach(function(option){
			if (option.title === optionTitle) {
			    option.votes += 1;
			}
		    });// ANY BETTER WAY TO DO THIS?!?
		    poll.save();

		    return res.redirect('/poll?title=' + pollTitle);
		});
	    }
	}
    });

});

// GET /poll
router.get('/poll', (req, res, next) => {
    Poll.findOne({ title: req.query.title }, (err, poll) => {
	if (err) return next(err);
	if (req.session.userId) { // if user is logged
	    User.findById(req.session.userId, function(error, user) {// look at whom s/he is
		if (error) return next(error);
		let pollObj = user.pollsHasParticipatedIn.filter(p => p.title === poll.title);
		if (pollObj.length !== 0) {// if user has already voted
		    let vote = pollObj[0].vote;
		    return res.render('poll', {
			pollTitle: poll.title,
			pollOptions: poll.options,
			pollAuthor: poll.author,
			userCanVote: false,
			userVote: vote
		    });
		} else {
		    return res.render('poll', {
			pollTitle: poll.title,
			pollOptions: poll.options,
			pollAuthor: poll.author,
			userCanVote: true
		    });
		}
	    });
	} else {
	    return res.render('poll', {
		pollTitle: poll.title,
		pollOptions: poll.options,
		pollAuthor: poll.author
	    });
	}
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
router.post('/createpoll', mid.requiresLogin, (req, res, next) => {
    let title = req.body.inputTitle;
    let options = req.body.inputOptions.split(/\r?\n/).filter(a => a !== '');

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
	    bcrypt.hash(req.body.inputPassword, 10, function(err, hash) {
		if (err) return next(err);

    		let userData = {
    		    username: req.body.inputUsername,
    		    email: req.body.inputEmail,
    		    password: hash
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
