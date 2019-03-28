const config = require('../config.js');
const nodemailer = require('nodemailer');

//send confirmation email when signing up
async function sendEmail(receiver) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
	host: config.mail.host,
	port: 587,
	secure: false,
	auth: {
	    user: config.mail.user,
	    pass: config.mail.pass
	}
    });

    let mailOptions = {
	from: config.mail.sender, // sender address
	to: receiver, // list of receivers
	subject: "Registration", // Subject line
	text: "You successfully registered to Polls", // plain text body
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
}

module.exports = {
    sendEmail: sendEmail
};
