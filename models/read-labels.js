var fs = require('fs');
var google = require('googleapis');
var authorize = require("./googleauth.js");

// Load client secrets from a local file.
var allLabels = fs.readFile('client_secret.json', function processClientSecrets(err, content) {
	if (err) {
		return response.status(404).send(err);
	}
	// Authorize a client with the loaded credentials, then call the Gmail API
	return authorize(JSON.parse(content), listLabels);
});

function listLabels(auth) {
	var gmail = google.gmail('v1');
	gmail.users.labels.list({
		auth: auth,
		userId: 'me',
	}, function(err, response) {
		var labels = response.labels;

		if (err) {
			return response.status(404).send(err);
		}

		if (labels.length == 0) {
			return response.status(404).send();
		} else {
			for (var i = 0; i < labels.length; i++) {
				var label = labels[i];

				if (label.name !== label.id) {
					console.log({
						id: i,
						name: label.name,
						labelNumber: label.id
					});
					return {
						id: i,
						name: label.name,
						labelNumber: label.id
					};
				}
			}
		}

	});
}

module.exports = allLabels;