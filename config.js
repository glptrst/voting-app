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
	user: process.env.user || configVariables.mail.user,
	pass: process.env.pass || configVariables.mail.pass
    }
};
