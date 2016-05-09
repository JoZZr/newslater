var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
	var mostviewed = sequelize.define("mostviewed", {
		message_id: {
			type: DataTypes.STRING,
			defaultValue: false
		},
		overall_views: {
			type: DataTypes.INTEGER,
			defaultValue: 1
		}
	}, {
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, "message_id", "overall_views");
			}
		}
	});

	return mostviewed;
};