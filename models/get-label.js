var fs = require('fs');
var google = require('googleapis');
var authorize = require("./googleauth.js");
var _ = require("underscore");

// Load client secrets from a local file.
module.exports = function(query, callback) {
	fs.readFile('client_secret.json', function processClientSecrets(err, content) {
		if (err) console.error(err);
		// Authorize a client with the loaded credentials, then call the Gmail API
		authorize(JSON.parse(content), function(auth) {
			getLabels(auth, query, callback);
		});
	});
};

var getLabels = function(auth, query, callback) {
	var gmail = google.gmail('v1');
	gmail.users.labels.get({
		auth: auth,
		userId: 'me',
		id: "Label_" + query
	}, function(err, response) {
		if (err) {
			return response.status(404).send(err);
		}

		callback(_.pick(response, "id", "messagesTotal"));
	});
};