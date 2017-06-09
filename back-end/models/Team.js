var mongoose = require('mongoose');

module.exports = mongoose.model('Event', {
	name: String,
	average_mmr: 0;
	players: [{
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	}]
});
