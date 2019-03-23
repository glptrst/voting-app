if (process.env.PRODUCTION !== 'true') {
    var configVariables = require('./configVariables');
}

module.exports = {
    PORT: process.env.PORT || 3000,
    db: {
	DBURI: process.env.DBURI || configVariables.db.DBURI,
    },
    mail: {
	sender: process.env.sender || configVariables.mail.sender,
	host: process.env.host || configVariables.mail.host,
	port: process.env.port || configVariables.mail.port,
	secure: process.env.secure || configVariables.mail.secure,
	user: process.env.user || configVariables.mail.user,
	pass: process.env.pass || configVariables.mail.pass
    }
};
