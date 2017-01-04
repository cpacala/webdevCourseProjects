var express = require("express");
var session = require("express-session");
var path = require("path");

var app = express();

app.use(session({secret: "12345"}));
app.use(express.static("public"));

app.set("port", 4000);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

var mysql = require('mysql');
var pool = mysql.createPool({
  host  : 'localhost',
  user  : 'student', 
  password: 'default',
  database: 'student'
});

//get HTML file
app.get('/', function(req, res, next){
	res.sendFile(path.join(__dirname, "/public/content.html"));
});

//get data from database and send to client
app.get('/tblData',function(req,res,next){

	console.log("tblData called");

	var context = {};
	pool.query('SELECT * FROM workouts', function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		console.log(rows);
		context = rows;
		res.send(context);
	});
});

//add row to database
app.post("/addRow", function(req, res, next){
	console.log("addRow called");
	var context = {};
	if(req.body.name.length > 1) //if form was empty name would be 1 char long
	{
		pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", 
			[req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs], function(err, result){
			if(err){
				next(err);
				return;
			}
			context.results = result.insertId;
		});
	}
	res.send(context);
});

//delete row from database
app.post("/delRow", function(req, res, next){
	console.log("delRow called");
	var context = {};

	pool.query("DELETE FROM workouts WHERE id = ?", [req.body.id], function(err, result){
		if(err){
			next(err);
			return;
		}
		context = {"s" : 1};
	});
	res.send(context);
});

//update row in database with sent data
app.post("/editRow", function(req, res, next){
	var context = {};
	pool.query("SELECT * FROM workouts WHERE id = ?", req.body.id, function(err, result){
		if(err){
			next(err);
			return;
		}
		if(result.length == 1){
			var curVal = result[0];
			pool.query("UPDATE workouts SET name = ?, reps = ?, weight = ?, date = ?, lbs = ? WHERE id = ?",
				[req.body.name || curVal.name, req.body.reps || curVal.reps, req.body.weight || curVal.weight,
				req.body.date || curVal.date, req.body.lbs || curVal.lbs, req.body.id], function(err, result){

				if(err){
					next(err);
					return;
				}
				context.results = "Success";
				res.send(context);
			});
		}
	});
});

//erase table contents (drop table and recreate it)
app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ 
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.send(context);
    })
  });
});


app.use(function(req, res){
	res.status(404);
	res.send("404, File not Found");
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type("plain/text");
	res.status(500);
	res.send("500, Internal Server Error");
});

app.listen(app.get("port"), function(){
	console.log("Express started on http://localhost: " + app.get("port") + "; press Ctrl-C to terminate.");
});
