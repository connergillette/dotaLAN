var Event = require('../models/event');
var User = require('../models/user');
var jwt = require('jwt-simple');

module.exports = {
	get: function(req, res) {
		Event.findOne({
			_id: req.params.id
		}).populate('user').exec(function(err, result) {
			// console.log(result + ' - from event.js GET');
			res.send(result);
			res.status(200);
		})
	},
	post: function(req, res) {
		// console.log(req.user + ' - from event.js');
		User.findOne({
			_id: req.user
		}).exec(function(err, user) {
			// console.log(user + ' - from event.js');
			req.body.event.user = user;
		}).then(function() {
			var event = new Event(req.body.event);

			// console.log(event.user + ' - from event.js');

			event.save();
			console.log(event);

			res.status(200);
		});
	}
}
