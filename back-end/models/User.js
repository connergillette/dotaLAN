var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
	name: String,
	ingame: String,
	email: String,
	pwd: String,
	steam_id: Number,
	events: Array
});
