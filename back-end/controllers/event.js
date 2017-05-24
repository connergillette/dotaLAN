var Event = require('../models/event');
var User = require('../models/user');
var jwt = require('jwt-simple');
var async = require('async');

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

		async.each(req.body.event.players, function(item, callback){
			User.findOne({
				email: item.trim()
			}, function(err, user){
				players.push(user);
				callback();
			});
		}, function(callback){
			req.body.event.players = players;
			var event = new Event(req.body.event);

			User.findOne({
				_id: req.user
			}, function(err, user){
				event.url = "#/event/" + event.id;
				user.events.push(event);
				user.save();
			});

			event.save();
			console.log("'" + event.name + "' event created");
			res.status(200);
		});
	}

		// 	var players = [];
		//
		// 	// TODO - Look into async library
		// 	async.each(req.body.event.players, function(item, callback){
		// 		User.findOne({
		// 				email: item.trim()
		// 			}, function(err, user) {
		// 				if (user) {
		// 					console.log(user.name);
		// 					players.push(user);
		// 				} else {
		// 					console.log(raw_players[user].trim() + ' was not found');
		// 				}
		// 			});
		// 			callback();
		// 	}, function(players){
		// 		console.log(players);
		// 	});
		// }).then(function() {
		// 	console.log("1");
		// 	req.body.event.players = players;
		// 	console.log("2");
		// 	var event = new Event(req.body.event);
		// 	console.log("3");
		// 	event.save();
		// 	console.log(event);
		//
		// 	console.log("Event saved");
		//
		// 	res.status(200);
		// });
}
