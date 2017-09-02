var Event = require('../models/event');
var Team = require('../models/team');
var User = require('../models/user');
var Series = require('../models/series');

var jwt = require('jwt-simple');
var mongoose = require('mongoose');
var async = require('async');

var https = require('https');

module.exports = {
	get: function(req, res) {
		Event.findOne({
			_id: req.params.id
		}).populate('user players teams').populate({
			path: 'schedule',
			populate: {
				path: 'series'
			}
		}).populate({
			path: 'teams',
			populate: {
				path: 'players'
			}
		}).exec(function(err, result) {
			res.send(result);
			console.log(result);
			res.status(200);
		});
	},
	post: function(req, res) {
		var count = 0;
		var playerEmails = [];
		var players = [];

		req.body.event.user = req.user;

		req.body.event.players = req.body.event.players.split(",");

		// User.findOne({
		// 	_id: req.user
		// }, function(err, user) {
		// 	var hasUser = false;
		// 	for (var i = 0; i < req.body.event.players.length; i++) {
		// 		if (req.body.event.players[i] == user.email) {
		// 			console.log("User already on list.");
		// 			hasUser = true;
		// 			break;
		// 		}
		// 		// console.log(req.body.event.players[i] + " does not match " + user.email);
		// 	}
		// 	if (!hasUser) {
		// 		req.body.event.players.push(user.email);
		// 		console.log("Admin user added to player list: " + user.email);
		// 	}
		// });

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

			event.save(function (err) {
  			if (err) console.log(err);
			});
			console.log("'" + event.name + "' event created");
			console.log(event);
			res.status(200);
			res.send(event);
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

				// team1.save();
				// team2.save();
				req.body.event.teams.push(team1);
				req.body.event.teams.push(team2);

				team1.save();
				team2.save();

				// var updated = new Event(req.body.event);
				// updated.save();
				console.log("Current event: " + req.body.event.teams);
				console.log(req.body.event._id);

				Event.findByIdAndUpdate({
					_id: req.body.event._id
				}, req.body.event, function(err, newEvent) {
					if (err) {
						console.log(err);
					} else {
						console.log("NEW EVENT");
						console.log(newEvent);
					}
				});

				// console.log("UPDATED EVENT: " + updated);

				console.log("Teams saved.");

			});
		}
	},
	createSchedule: function(req, res) {
		var schedule = [];
		console.log("TEAMS: " + req.body.event.teams);

		for (var i = 0; i < req.body.event.teams.length - 1; i++) {
			var series = new Series();
			series.radiant = req.body.event.teams[i];
			series.dire = req.body.event.teams[i++];
			series.date = req.body.event.date;

			series.bestOf = req.body.event.bestOf;

			schedule.push(series);

			series.save();
			console.log(series);
			// TODO: Coin flip for side / pick, implement timing offsets,
			// single / double elim, best of, optional match_id

			i++;
		}

		// console.log("CURRENT SCHEDULE ARRAY: " + schedule);
		req.body.event.schedule = schedule;
		console.log(schedule);
		Event.update({
			_id: mongoose.Types.ObjectId(req.body.event._id)
		}, req.body.event);
		// res.send(schedule);
		// console.log("POST UPDATE: " + req.body.event.schedule);
		res.status(200);
	},
	getTeams: function(req, res) {
		Event.findOne({
			_id: req.params.id
		}).populate("teams").exec(function(err, event) {
			var teams = [];
			console.log(event);
			async.each(event.teams, function(team, callback) {
				console.log(team._id);
				Team.find({
					_id: team._id
				}).populate("players").exec(function(err, result) {
					console.log(result);
					teams.push(result);
				});
			}, function() {
				console.log("CALL WENT THROUGH");
				console.log(teams);
				res.send(teams);
				res.status(200);
			});
		});
	}
}
