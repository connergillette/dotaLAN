var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
	name: String,
	ingame: String,
	email: String,
	pwd: String,
	mmr: Number,
	totalGames: Number,
	gamesWon: Number,
	gamesLost: Number,
	positions: Array
});
