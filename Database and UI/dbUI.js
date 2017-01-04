/*
 * Uses mysql to query a database and express handlebars to display information
 */

var express = require("express");
var session = require("express-session");

var app = express();
var handlebars = require("express-handlebars").create({defaultLayout:"main"});

app.use(session({secret: "12345"}));
app.use(express.static("public"));

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
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


/*
 * Get the entire workout table and display it to the user
 */
app.get('/',function(req,res,next){
	var context = {};
	pool.query('SELECT * FROM workouts', function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		context = rows;
		res.sendFile("content.html");
		res.send(rows);
	});
});

/*
 * Erase all information in the database
 */
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

/*
app.post('/',function(req,res,next){
  var context = {};
  pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.render('home', context);
  });
});



*/
/*
app.post('/',function(req,res,next){
  var context = {};
  pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.render('home', context);
  });
});




app.get('/safe-update',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE workouts SET name=?, done=?, due=? WHERE id=? ",
        [req.query.name || curVals.name, req.query.done || curVals.done, req.query.due || curVals.due, req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
        context.results = "Updated " + result.changedRows + " rows.";
        res.render('home',context);
      });
    }
  });
});

*/




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