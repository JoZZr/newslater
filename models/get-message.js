var fs = require('fs');
var google = require('googleapis');
var authorize = require("./googleauth.js");
var _ = require("underscore");
var parseMessage = require('gmail-api-parse-message');
var listLabels = require("./list-labels.js");


// Load client secrets from a local file.
module.exports = function(queryId, queryType, queryInfo, callback) {
	fs.readFile('client_secret.json', function processClientSecrets(err, content) {
		if (err) console.error(err);
		// Authorize a client with the loaded credentials, then call the Gmail API
		authorize(JSON.parse(content), function(auth) {
			getMessage(auth, queryId, queryType, queryInfo, callback);
		});
	});
};

var addProperties = function(response, callback) {

	//ADD ordered label names property
	var userLabels = _.filter(response.labelIds, function(labels) {
		return labels.match(/Label_/i);
	});
	var allLabels = [];
	var orderedLabels = [];
	var renamedLabels = [];
	var filteredLabels = [];

	for (var i = 0; i < userLabels.length; i++) {
		orderedLabels.push(parseInt(userLabels[i].replace(/Label_/i, ""), 10));
	}

	orderedLabels.sort(function sortNumber(a, b) {
		return a - b;
	});

	orderedLabels.forEach(function(label) {
		renamedLabels.push("Label_" + label);
	});

	response.labels = renamedLabels;

	//ADD subject property
	response.subject = response.payload.headers.filter(function(subject) {
		return subject.name === "Subject";
	})[0].value;


	callback(_.pick(response, "id", "labels", "subject"));
};

var removeElements = function(response, callback) {
	var body = parseMessage(response).textHtml;
	var remove = [];

	//REMOVE e-mail, ubsubscribe links & view in browser
	remove.push(new RegExp("newslater.main@gmail.com", "g"));
	remove.push(new RegExp("<a.*hier.*<\/a>", "g"));

	//Mailchimp
	remove.push(new RegExp("<a.*\.campaign-archive.*<\/a>", "g"));
	remove.push(new RegExp("<a.*list-manage.com.*<\/a>", "g"));

	//SecretEscapes.de
	remove.push(new RegExp("<a.*.Verteilerliste.*<\/a>", "g"));
	remove.push(new RegExp("<a.*.view.email.*<\/a>", "g"));

	//Zeit.de
	remove.push(new RegExp("<a.*newsletterversand\.zeit\.de.*<\/a>", "g"));

	for (var i = 0; i < remove.length; i++) {
		body = body.replace(remove[i], "");
	}
	
	callback(body);
};

var getMessage = function(auth, queryId, queryType, queryInfo, callback) {
	var gmail = google.gmail('v1');

	gmail.users.messages.get({
		auth: auth,
		userId: 'me',
		id: queryId,
		format: queryType || "full"
	}, function(err, response) {
		if (err) {
			return "Mail not found";
		}

		if (queryInfo === "body") {
			removeElements(response, callback);
		} else {
			addProperties(response, callback);
		}
	});
};
