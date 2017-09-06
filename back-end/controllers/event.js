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
		}).populate({
			path: 'schedule',
			populate: {
				path: 'radiant dire'
			}
		}).exec(function(err, result) {
			res.send(result);
			// console.log(result);
			res.status(200);
		});
	},
	post: function(req, res) {
		var count = 0;
		var playerEmails = [];
		var players = [];

		req.body.event.user = req.user;

		req.body.event.players = req.body.event.players.split(",");

		User.findOne({
			_id: req.user
		}, function(err, user) {
			var hasUser = false;
			for (var i = 0; i < req.body.event.players.length; i++) {
				if (req.body.event.players[i] == user.email) {
					console.log("User already on list.");
					hasUser = true;
					break;
				}
				// console.log(req.body.event.players[i] + " does not match " + user.email);
			}
			if (!hasUser) {
				req.body.event.players.push(user.email);
				console.log("Admin user added to player list: " + user.email);
			}
		});

		async.each(req.body.event.players, function(item, callback) {
			User.findOne({
				email: item.trim()
			}, function(err, user) {
				players.push(user);
				console.log(user);
				callback();
			});
		}, function(callback) {
			req.body.event.players = players;
			// console.log(players);
			var event = new Event(req.body.event);

			User.findOne({
				_id: req.user
			}, function(err, user) {
				event.url = "#/event/" + event.id;
				user.events.push(event);
				user.save();
			});

			// TODO: Handle this
			event.save(function(err) {
				if (err) {
					console.log(err);
				}
			});
			console.log("'" + event.name + "' event created");
			res.status(200);
			res.send(event);
		});
	},
	// TODO: Implement / compare multiple team distribution algorithms
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
				// Loop this one team at a time based on number of players
				var NUMBER_OF_TEAMS = players.length / 5;

				var minAverage = 0;
				var maxAverage = 0;

				for (var i = 0; i < NUMBER_OF_TEAMS; i++) {
					// console.log("TEAM " + i);
					var team = new Team();
					var mmrTotal = 0;
					for (var j = 0; j < 5; j++) {
						var player = players[i + (j * (NUMBER_OF_TEAMS))]; // Player distribution algorithm
						console.log("[" + i + ", " + j + "]");
						console.log(player);
						team.players.push(player);
						mmrTotal += player.mmr;
					}
					team.name = "Team " + (i + 1);
					team.average_mmr = mmrTotal / 5;
					team.save();
					req.body.event.teams.push(team);
					if (i == 0) {
						minAverage = team.average_mmr;
						maxAverage = team.average_mmr;
					} else if (team.average_mmr > maxAverage) {
						maxAverage = team.average_mmr;
					} else if (team.average_mmr < minAverage) {
						minAverage = team.average_mmr;
					}
					console.log("MMR RANGE ACROSS ALL TEAMS: " + (maxAverage - minAverage));
				}
				Event.findByIdAndUpdate(req.body.event._id, req.body.event, function(err) {
					if (err) {
						console.log(err);
					}
				});
			});
		}
	},
	createSchedule: function(req, res) {
		var schedule = [];
		// console.log("TEAMS: " + req.body.event.teams);

		for (var i = 0; i < req.body.event.teams.length - 1; i++) {
			var series = new Series();
			series.radiant = req.body.event.teams[i];
			series.dire = req.body.event.teams[i + 1];
			series.date = req.body.event.date;

			series.bestOf = req.body.event.bestOf;

			schedule.push(series);

			series.save();
			// TODO: Coin flip for side / pick, implement timing offsets,
			// single / double elim, best of, optional match_id

			i++;
		}

		// console.log("CURRENT SCHEDULE ARRAY: ");
		// console.log(schedule);
		req.body.event.schedule = schedule;
		// console.log(req.body.event._id);
		Event.findByIdAndUpdate(req.body.event._id, req.body.event, function(result) {
			if (result) {
				console.log(result);
			}
		});
		// console.log(req.body.event);
		res.send(schedule);
		res.status(200);
	},
	getTeams: function(req, res) {
		Event.findOne({
			_id: req.params.id
		}).populate("teams").exec(function(err, event) {
			if (event) {
				var teams = [];
				// console.log(event);
				async.each(event.teams, function(team, callback) {
					// console.log(team._id);
					Team.find({
						_id: team._id
					}).populate("players").exec(function(err, result) {
						// console.log(result);
						teams.push(result);
					});
				}, function() {
					// console.log("CALL WENT THROUGH");
					// console.log(teams);
					res.send(teams);
					res.status(200);
				});
			}
		});
	}
}
