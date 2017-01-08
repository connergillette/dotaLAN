var User = require('../models/user');
var jwt = require('jwt-simple');
var moment = require('moment');

module.exports = {
	register: function(req, res) {
		console.log(req.body);

		User.findOne({
			email: req.body.email
		}, function(err, existingUser) {

			if (existingUser)
				return res.status(409).send({
					message: 'Email is already registered'
				});

			var user = new User(req.body);

			user.positions = positionArray(req.body);

			user.save(function(err, result) {
				if (err) {
					res.status(500).send({
						message: err.message
					});
				}
				res.status(200).send({
					token: createToken(result)
				});
			})
		});
	},
	login: function(req, res) {
		User.findOne({
			email: req.body.email
		}, function(err, user) {
			if (!user)
				return res.status(401).send({
					message: 'Email or Password is invalid'
				});

			if (req.body.pwd == user.pwd) {
				console.log(req.body, user.pwd);
				res.send({
					token: createToken(user)
				});
			} else {
				return res.status(401).send({
					message: 'Invalid email and/or password'
				});
			}
		});
	},
	dashboard: function(req, res) {
		User.findOne({
			_id: req.user
		}, function(err, user) {
			if (!user) {
				return res.status(401).send({
					message: 'Current user data could not be found'
				});
			}
			res.send(user);
		});
	}
}

function createToken(user) {
	var payload = {
		sub: user._id,
		iat: moment().unix(),
		exp: moment().add(14, 'days').unix()
	};
	return jwt.encode(payload, 'secret');
}

function positionArray(body) {
	var pos = [];

	if (body.position1) {
		pos.push(1);
	}
	if (body.position2) {
		pos.push(2);
	}
	if (body.position3) {
		pos.push(3);
	}
	if (body.position4) {
		pos.push(4);
	}
	if (body.position5) {
		pos.push(5);
	}
	if (pos.length > 0) {
		return pos;
	}
}
