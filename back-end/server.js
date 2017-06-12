var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// var Dota2API = require('dota2-api');
// var da = Dota2API.create('254EBE930E35967F545678C5FB925B1D');

var auth = require('./controllers/auth');
var message = require('./controllers/message');
var events = require('./controllers/event');
var checkAuthenticated = require('./services/checkAuthenticated');
var cors = require('./services/cors');

//Middleware
app.use(bodyParser.json());
app.use(cors);

//Requests
app.get('/api/message', message.get);

app.get('/dashboard/', checkAuthenticated, auth.dashboard);

app.get('/player/:id', function(req, res, next) {
	res.id = req.params.id;
	next();
}, auth.dashboard);

app.get('/api/teams', events.getTeams);

app.post('/api/message', checkAuthenticated, message.post);

app.post('/auth/register', auth.register);

app.post('/auth/login', auth.login);

app.post('/api/event/', checkAuthenticated, events.post);

app.post('/api/team/add', checkAuthenticated, events.createTeams)

app.get('/api/event/:id', function(req, res, next) {
	res.id = req.params.id;
	next();
}, events.get);

//Connection
mongoose.connect("mongodb://localhost:27017/test", function(err, db) {
	if (!err) {
		console.log("we are connected to mongo");
	}
})

var server = app.listen(5000, function() {
	console.log('listening on port', server.address().port)
})
