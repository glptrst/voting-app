if (process.env.PRODUCTION !== 'true') {
    var configVariables = require('./configVariables');
}

module.exports = {
    PORT: process.env.PORT || 3000,
    db: {
	DBURI: process.env.DBURI || configVariables.db.DBURI,
    },
    mail: {
	sender: configVariables.mail.sender,
	host: configVariables.mail.host,
	port: configVariables.mail.port,
	secure: configVariables.mail.secure,
	user: configVariables.mail.user,
	pass: configVariables.mail.pass
    }
};
