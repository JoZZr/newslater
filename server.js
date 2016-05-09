var express = require("express");
var _ = require('underscore');
var jsdom = require("jsdom");

var db = require("./db.js");
var cache = require("./cache.js");
var listLabels = require("./models/list-labels.js");
var getLabels = require("./models/get-label.js");
var listMessages = require("./models/list-messages.js");
var getMessage = require("./models/get-message.js");

var app = express();
var PORT = process.env.PORT || 3000;


//ROUTE TO index.html
app.use("/", express.static(__dirname + '/html'));

app.use("/oauth", express.static(__dirname + '/oauth.js'));

//GET all labels or specific label by label id
app.get("/labels", cache(5), function(req, res) {
	var query = req.query.id;

	if (typeof query === "undefined") {
		listLabels(function(items) {
			res.json(items);
		});
	} else {
		getLabels(query, function(items) {
			res.json(items);
		});
	}
});

//GET all messages for specific label by label id
app.get("/messages", function(req, res) {
	var query = req.query.id;

	if (typeof query === "undefined") {
		res.send("Please specify a label id");
	} else {
		listMessages(query, function(items) {
			res.json(items);
		});
	}
});

//GET one message by message id; specify response and value and information requested
app.get("/message", cache(5), function(req, res) {
	var queryId = req.query.id;
	var queryType = req.query.type || "full";
	var queryInfo = req.query.info;

	if (typeof queryId === "undefined") {
		res.send("Please specify a message id");
	} else {
		getMessage(queryId, queryType, queryInfo, function(message) {
			if (queryInfo === "body") {
				db.mostviewed.findOne({
					whe: {
						message_id: queryId
					}
				}).then(function(message) {
					if (message) {
						var overall_views = message.overall_views;

						message.update({
							overall_views: ++overall_views
						});
					} else {
						db.mostviewed.create({
							message_id: queryId
						});
					}
				}, function(e) {
					console.error(e);
				});

				jsdom.env(
					"", [""],
					function(err, window) {
						res.send(message);
					}
				);
			} else {
				res.json(message);
			}
		});
	}
});

//GET all category labels
app.get("/categories", function(req, res) {
	listLabels(function(items) {
		res.json(_.where(items, {
			provider: "category"
		}));
	});
});

//GET most viewed messages
app.get("/mostviewed", function(req, res) {
	db.mostviewed.findAll({
		where: {
			overall_views: {
				gt: 1
			}
		},
		order: "`overall_views` DESC",
		limit: 25
	}).then(function(results) {
		var filtered = [];

		results.forEach(function(result) {
			filtered.push(result.toPublicJSON());
		})

		res.send(filtered);
	}, function(e) {
		res.status(404).send(e);
	});
});

//LISTEN TO REQUESTS
db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("Express listening on port " + PORT + "!");
	});
});