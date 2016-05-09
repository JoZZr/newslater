var fs = require('fs');
var google = require('googleapis');
var authorize = require("./googleauth.js");
var _ = require("underscore");

// Load client secrets from a local file.
module.exports = function (query, callback) {
	fs.readFile('client_secret.json', function processClientSecrets(err, content) {
		if (err) console.error(err);
		// Authorize a client with the loaded credentials, then call the Gmail API
		authorize(JSON.parse(content), function (auth) {
			listMessages(auth, query, callback);
		});
	});
};

var listMessages = function(auth, query, callback) {
	var gmail = google.gmail('v1');
	
	gmail.users.messages.list({
		auth: auth,
		userId: 'me',
		includeSpamTrash: false,
		labelIds: "Label_" + query
	}, function(err, response) {
		if (err) {
		 	return response.status(404).send(err);
		}
		
		callback(response);
	});
};