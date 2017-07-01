var mongoose = require('mongoose');

module.exports = mongoose.model('Series', {
	date: Date,
	bestOf: String,
	match_id: String,
	radiant: {
		type: mongoose.Schema.ObjectId,
		ref: 'Team'
	},
	dire: {
		type: mongoose.Schema.ObjectId,
		ref: 'Team'
	}
});
