var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


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

app.post('/api/message', checkAuthenticated, message.post);

app.post('/auth/register', auth.register);

app.post('/auth/login', auth.login);

app.post('/api/event', checkAuthenticated, events.post);

app.get('/api/event', function(req, res, next) {
	console.log(req.params);
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
