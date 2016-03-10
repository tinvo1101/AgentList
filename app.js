var express		= require('express');
var mongoose	= require('mongoose');
var morgan		= require('morgan');
var Agent		= require('./Agent.js');
var bodyParser	= require('body-parser');

var app = express();
var port = process.env.PORT || 3000;

var db  = mongoose.connect('mongodb://localhost:27017/agentlist');

// try connection to the database
mongoose.connect('connected', function() {
	console.log("Connected to database successfully!!!")
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(morgan('dev'));


// get request handler
app.get('/agents', function(req, res) {
	Agent.find({}, function(err, data) {
		if(err) {
			console.log(err);
			throw err;
		}
		res.json(data);
	});
});


// post request handler
app.post('/agents', function(req, res) {
	Agent.find({'agentID' : req.body.agentID }, function(err, data) {
		console.log(req.body);
		if(err) {
			console.log(err);
			throw err;
		}

		if(data.length == 0) {
			var agent = new Agent(req.body);
			agent.save(function(err, data) {
				if(err) {
					console.log(err);
					throw err;
				}
				res.json(data);
			});
		} else {
			res.json('Id taken!!!');
		}
	});
	
});


// delete request handler
app.delete('/agents/:id', function(req, res) {
	Agent.remove({_id: req.params.id }, function(err) {
		if(err) {
			console.log(err);
			throw err;
		}
		res.json("Deleted");
	});
});


// server is listenning
app.listen(port, function() {
	console.log('Listening on ' + port);
});



// NOTE: 
// USE THIS: >db.mycol.find({},{"title":1,_id:0}).limit(1).skip(1)
// to find the data in MongoDB 



// console.log("HERE");
// 	var Person = new Person({
// 		agentID			: "123",
// 		agentName		: "Sample",
// 		haveWWW			: true,
// 		onHomePage		: true,
// 		brandedBanner	: true,
// 		aboveTheFold	: true,
// 		onFacebook		: true,
// 		dateAdded		: Date(),
// 		dateModified	: Date(),
// 		portalLink		: "123",
// 		validSlug		: true,
// 		websiteLink		: "123.com"
// 	});
// 	Person.save(function(err, data) {
// 		if(err) {
// 			console.log(err);
// 		}
// 		console.log("Saved");
// 	});