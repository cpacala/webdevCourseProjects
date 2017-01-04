/*
 * A simple server side trip planner that displays the current trip when a GET request
 * is received and update the trip when a POST request is received
 */

var express = require("express");
var session = require("express-session");

var app = express();
var handlebars = require("express-handlebars").create({defaultLayout:"main"});

app.use(session({secret: "12345"}));

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("port", 3000);


var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*
 * Get the current workout. Either display the newSession page if no session open
 * or request the session by name and display the current trip.
 */
app.get('/', function(req, res)
{
	var context = {};
	if(!req.session.name) //new session as no current name
	{
		res.render("newSession", context); //display the new session
		return;
	}
	
	//display the current trip for the given req.session.name
	context.name = req.session.name
	
	context.tripCount = req.session.trip.length || 0;
	context.trip = req.session.trip || [];
	console.log(context.trip);
	
	res.render("home", context);
});

/*
 * Update the current session if the names match or show the newSession page if they don't
 */
app.post('/', function(req, res)
{
	var context = {};

	//add a new trip to the planner
	if(req.body["New Trip"])
	{
		req.session.name = req.body.name;
		req.session.trip = [];
		req.session.curId = 0;
	}
	
	//display the new session page if there is no name
	if(!req.session.name)
	{
		res.render('newSession', context);
		return;
	}
	
	//add a new route to the trip
	if(req.body["Add Route"])
	{
		req.session.trip.push({"num":req.body.sNum, "street":req.body.sStreet, "city":req.body.sCity, 
											"state":req.body.sState, "country":req.body.sCountry, "id":req.session.curId});
		req.session.curId++;
	}
});

//404
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

//500
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});


app.listen(app.get("port"), function(){
  console.log("Express started on http://localhost:" + app.get("port") + "; press Ctrl-C to terminate.");
});

