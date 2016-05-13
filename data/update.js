var db = require("../db.js");
var getMessage = require("../models/get-message.js");

var dbCall = {
	mostviewed: {
		refresh: function(queryId) {
			db.mostviewed.findOne({
				where: {
					message_id: queryId
				}
			}).then(function(message) {
				if (message) {
					var overall_views = message.overall_views;

					message.update({
						overall_views: ++overall_views
					});
				} else {
					getMessage(queryId, "full", "api", function(res) {
						db.mostviewed.create({
							message_id: queryId,
							name: res.subject,
							labels: res.labels.toString()
						});
					});
				}
			}, function(e) {
				console.error(e);
			});
		}
	}
};


module.exports = dbCall;