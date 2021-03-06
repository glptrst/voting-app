var config = require('./config.js');
let express = require('express');
let bodyParser = require('body-parser');
let ejs = require('ejs');
let mongoose = require('mongoose');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
const nodemailer = require('nodemailer');
let app = express();

// mongodb connection
mongoose.connect(config.db.DBURI, { useNewUrlParser: true, useCreateIndex: true });
let db = mongoose.connection;
// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// use sessions for traking logins
app.use(session({
    secret: config.session.SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
	mongooseConnection: db
    })
}));

// make user ID available in templates
app.use((req, res, next) => {
    res.locals.currentUser = req.session.userId;
    next();
});

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

let routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('File not found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
	message: err.message,
	error: {}
    });
});

// listen on port 3000
app.listen(config.PORT, () => {
    console.log('Listening on port 3000');
});
