var Event = require('../models/event');
var User = require('../models/user');
var jwt = require('jwt-simple');

module.exports = {
	get: function(req, res) {
		Event.findOne({
			_id: req.params.id
		}).populate('user players').exec(function(err, result) {
			console.log(result.players);
			res.send(result);
			res.status(200);
		})
	},
	post: function(req, res) {
		var count = 0;
		var players = [];
		User.findOne({
			_id: req.user
		}, function(err, user) {
			// console.log(user + ' - from event.js');
			req.body.event.user = user;
			req.body.event.players = req.body.event.players.split(",");
			for (player in req.body.event.players) {
				User.findOne({
					email: req.body.event.players[player].trim()
				}, function(err, user) {
					if (user) {
						players[count] = user;
						count++;
					} else {
						console.log(raw_players[player].trim() + ' was not found');
					}
				});
			}
		}).then(function() {
			req.body.event.players = players;
			var event = new Event(req.body.event);

			event.save();
			console.log(event);

			res.status(200);
		})
	}
}
