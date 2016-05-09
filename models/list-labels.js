var fs = require('fs');
var google = require('googleapis');
var authorize = require("./googleauth.js");
var _ = require("underscore");

// Load client secrets from a local file.
module.exports = function(callback) {
	fs.readFile('client_secret.json', function processClientSecrets(err, content) {
		if (err) console.error(err);
		// Authorize a client with the loaded credentials, then call the Gmail API
		authorize(JSON.parse(content), function(auth) {
			listLabels(auth, callback);
		});
	});
};

var matchLabelNames = function(response, callback) {
	var providers = {
		prefix: "Label_"
	};

	listLabels(function(items) {
		items.forEach(function(item) {
			if (item.provider === "category" && (/([\w &]+)$/).test(item.name)) {
				providers[item.id.match(/\d+/)] = item.name.match(/([\w &]+)$/)[1];
			} else if (item.provider === "category") {
				providers[item.id.match(/\d+/)] = item.name;
			} else {
				providers[item.id.match(/\d+/)] = item.provider;
			}
		});

		callback(response);
	});
};

var listLabels = function(auth, callback) {
	var gmail = google.gmail('v1');
	gmail.users.labels.list({
		auth: auth,
		userId: 'me'
	}, function(err, response) {
		if (err) {
			return response.status(404).send(err);
		}

		callback(_.chain(response.labels)
			.where({
				type: "user",
			})
			.map(function(currentObject) {
				currentObject.provider = currentObject.name.match(/(\w*\.+\w*)$/) ? true : false;
				currentObject.path = currentObject.name;

				if ((/([\w &]+)$/).test(currentObject.name)) {
					currentObject.label = currentObject.name.match(/([\w &.]+)$/)[1];
				} else {
					currentObject.label = currentObject.name;
				}

				return _.pick(currentObject, "id", "label", "path", "provider");
			})
			.value()
		);
	});
};