/*
 * A how to guide for leveraging the Google Maps API.
 * Uses express handlebars
 *
 */


 //initialize express
var express = require("express");
var session = require("express-session");
var app = express();

//initialize handlebars
var handlebars = require("express-handlebars").create({defaultLayout:"main"});

app.use(session({secret: "12345"}));
app.use(express.static("public"));

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("port", 3000);

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Home Page of How To Guide
app.get('/',function(req,res,next){
	res.render('home');
});

//All parts of How To Guide
app.get('/Part1',function(req,res,next){
	res.render('Part1');
});

app.get('/Part2',function(req,res,next){
	res.render('Part2');
});

app.get('/Part3',function(req,res,next){
	res.render('Part3');
});

app.get('/Part4',function(req,res,next){
	res.render('Part4');
});

app.get('/Part5',function(req,res,next){
	res.render('Part5');
});

app.get('/Part6',function(req,res,next){
	res.render('Part6');
});

app.get('/Part7',function(req,res,next){
	res.render('Part7');
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

//listen on the port set above for connections
app.listen(app.get("port"), function(){
  console.log("Express started on http://localhost:" + app.get("port") + "; press Ctrl-C to terminate.");
});
