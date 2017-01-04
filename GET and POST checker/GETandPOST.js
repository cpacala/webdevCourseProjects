/*
 * A simple assignment to demonstrate using GET and POST functions
 */

var express = require("express");

var app = express();
var handlebars = require("express-handlebars").create({defaultLayout:"main"});

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("port", 3000);


var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//GET or POST response
app.post("/", function(req, resp){
	var respData = {};

	//handle URL data
	var getData = [];
	for(var d in req.query)
	{
		getData.push({"key" : d, "value" : req.query[d]});
	}
	respData.getList = getData;

	//handle POST data
	var postData = [];
	for(var d in req.body)
	{
		postData.push({"key" : d, "value" : req.body[d]});
	}
	respData.postList = postData;

	resp.render("home", respData);
});

//GET response
app.get("/", function(req, resp){
	var data = [];
	for(var d in req.query)
	{
		data.push({"key" : d, "value" : req.query[d]});
	}
	var respData = {};
	respData.getList = data;
	resp.render("home", respData);
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

