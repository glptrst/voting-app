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
	user: process.env.mail.user || configVariables.mail.user,
	pass: process.env.mail.pass || configVariables.mail.pass
    }
};
