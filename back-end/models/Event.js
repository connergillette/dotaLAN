var mongoose = require('mongoose');

module.exports = mongoose.model('Event', {
	name: String,
	date: Date,
	format: String,
	bestOf: String,
	players: String,
	admin: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	}
});
