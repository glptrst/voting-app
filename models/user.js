let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let UserSchema = new mongoose.Schema({
    email: {
	type:String,
	unique: true,
	required: true,
	trim: true
    },
    username: {
	type: String,
	required: true,
	trim: true
    },
    password: {
	type: String,
	required: true
    }
});
// hash password before saving to database
UserSchema.pre('save', function(next) {
    let user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
	if (err)
	    return next(err);

	user.password = hash;
	next();
    });
});
let User = mongoose.model('User', UserSchema);
module.exports = User;
