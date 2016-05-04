var fs = require('fs');
var google = require('googleapis');
var authorize = require("./googleauth.js");

// Load client secrets from a local file.
var list = function() {
	return fs.readFile('client_secret.json', function processClientSecrets(err, content) {
		if (err) {
			return response.status(404).send(err);
		}
		// Authorize a client with the loaded credentials, then call the Gmail API
		return authorize(JSON.parse(content), listLabels);
	});
};

var listLabels = function(auth) {
	var gmail = google.gmail('v1');
	gmail.users.labels.list({
		auth: auth,
		userId: 'me',
	}, function(err, response) {
		if (err) {
			return response.status(404).send(err);
		}
		console.log(response.labels);
		return response.labels;
	});
}

module.exports = list;