var Event = require('../models/event');
var User = require('../models/user');
var jwt = require('jwt-simple');

module.exports = {
	get: function(req, res) {
		Event.findOne({
			_id: req.params.id
		}).exec(function(err, result) {
			res.send(result);
			res.status(200);
		})
	},
	post: function(req, res) {
		User.findOne({
			_id: req.user
		}).exec(function(err, user) {
			req.body.event.user = user;
		});
		var event = new Event(req.body.event);

		console.log(event);

		event.save();

		res.status(200);
	}
}
