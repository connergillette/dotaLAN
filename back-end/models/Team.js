var mongoose = require('mongoose');

module.exports = mongoose.model('Team', {
	name: String,
	average_mmr: String,
	players: [{
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	}]
});
