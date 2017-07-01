var mongoose = require('mongoose');

module.exports = mongoose.model('Event', {
	name: String,
	date: Date,
	format: String,
	bestOf: String,
	// players: String,
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	players: [{
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	}],
	teams: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Team'
	}],
	schedule: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Series'
	}]
});
