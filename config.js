if (process.env.PRODUCTION !== 'true') {
    var configVariables = require('./configVariables');
}

module.exports = {
    PORT: process.env.PORT || 3000,
    db: {
	DBURI: process.env.db.DBURI || configVariables.db.DBURI,
    },
    mail: {
	sender: process.env.mail.sender || configVariables.mail.sender,
	host: process.env.mail.host || configVariables.mail.host,
	port: process.env.mail.port || configVariables.mail.port,
	secure: process.env.mail.secure || configVariables.mail.secure,
	user: process.env.mail.user || configVariables.mail.user,
	pass: process.env.mail.pass || configVariables.mail.pass
    }
};
