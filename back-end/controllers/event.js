var Event = require('../models/event');
var Team = require('../models/team');
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
			}, function() {
				players.sort(function(a, b) {
					return a.mmr - b.mmr;
				});

				var team1 = new Team();
				var team2 = new Team();

				var total1 = 0;
				var total2 = 0;

				for (var i = 0; i < 10; i++) {
					team1.players.push(players[i]);
					total1 += players[i].mmr;
					team2.players.push(players[i + 1]);
					total2 += players[i + 1].mmr;
					i += 1;
				}

				team1.average_mmr = parseInt(total1) / 5;
				team1.name = "Team 1 Name";

				team2.average_mmr = parseInt(total2) / 5;
				team2.name = "Team 2 Name";

				// console.log("TEAM 1: " + team1);
				// console.log("TEAM 2: " + team2);

				team1.save();
				team2.save();

				console.log("Teams saved.");

			});
		}
	},
	getTeams: function(req, res) {
		Team.find({}).populate("players").exec(function(err, result) {
			// console.log(result);
			res.send(result);
			res.status(200);
		})
	}
}
