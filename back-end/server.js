var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var User = require('./models/user');
var auth = require('./controllers/auth');
var message = require('./controllers/message');
var jwt = require('jwt-simple');
var moment = require('moment');

mongoose.connect("mongodb://localhost:27017/test", function(err, db) {
	if (!err) {
		console.log("we are connected to mongo");
	}
});

app.use(bodyParser.json());

function checkAuthenticated(req, res, next) {
	if (!req.header('Authorization')) {
		return res.status(401).send({
			message: 'Please make sure your request has an Authorization header'
		});
	} else {

		var token = req.header('Authorization').split(' ')[1];
		var payload = jwt.decode(token, 'secret');

		if (payload.exp <= moment().unix()) {
			return res.status(401).send({
				message: 'Token has expired'
			});
		}

		req.user = payload.sub;
		next();
	}
}

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
	next();
})

app.post('/api/login', checkAuthenticated, function(req, res) {
	console.log(req.body);
	res.status(200);
})

app.get('/api/message', message.get);
app.post('/api/message', message.post);

app.get('/api/login', GetUsers);

app.post('/auth/register', auth.register);

function GetUsers(req, res) {
	User.find({}).exec(function(err, result) {
		res.send(result);
	})
}

var server = app.listen(5000, function() {
	console.log('listening on port', server.address().port)
});
