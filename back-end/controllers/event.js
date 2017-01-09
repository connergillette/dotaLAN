var Event = require('../models/event');

module.exports = {
	get: function(req, res) {
		console.log(req.params.id + '- from event.js');
		Event.findOne({
			_id: req.params.id
		}).exec(function(err, result) {
			res.send(result);
			res.status(200);
			console.log('success! we found ' + result.name);
		})
	},
	post: function(req, res) {
		req.body.event.admin = req.user;
		var event = new Event(req.body.event);

		event.save();
		console.log('new event added: ' + event.name);

		res.status(200);
	}
}
