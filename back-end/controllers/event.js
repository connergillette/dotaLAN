var Event = require('../models/event');
var User = require('../models/user');
var jwt = require('jwt-simple');
var async = require('async');

var https = require('https');

module.exports = {
	get: function(req, res) {
		Event.findOne({
			_id: req.params.id
		}).populate('user players').exec(function(err, result) {
			// console.log(result.players);
			res.send(result);
			res.status(200);
		})
	},
	post: function(req, res) {
		var count = 0;
		var playerEmails = [];
		var players = [];

		req.body.event.user = req.user;

		req.body.event.players = req.body.event.players.split(",");

		async.each(req.body.event.players, function(item, callback) {
			User.findOne({
				email: item.trim()
			}, function(err, user) {
				players.push(user);
				callback();
			});
		}, function(callback) {
			req.body.event.players = players;
			var event = new Event(req.body.event);

			User.findOne({
				_id: req.user
			}, function(err, user) {
				event.url = "#/event/" + event.id;
				user.events.push(event);
				user.save();
			});

			event.save();
			console.log("'" + event.name + "' event created");
			res.status(200);
		});
	},
	createTeams: function(req, res) {
		if (req.body.players.length % 5 != 0) {
			res.status(400);
			res.send("You don't enough players for even teams.");
		} else {
			var players = req.body.players;
			async.each(players, function(player, callback) {
				https.get('https://api.opendota.com/api/players/' + player.steam_id, function(response) {
					var text = '';
					response.on('data', function(data) {
						text += data;
					});

					response.on('end', function() {
						var json = JSON.parse(text);
						if (json.mmr_estimate.estimate != null) {
							player.mmr = json.mmr_estimate.estimate;
						}
						callback();
					});
				});
			}, function(callback) {
				players.sort(function(a, b) {
					return a.mmr - b.mmr;
				});

				console.log(players);
			});
		}
	}
}
