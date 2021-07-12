
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require("body-parser");
// ------------- database ------------
var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '451111',
	database : 'my_db'
});

// ------------------------------------

app.set('view engine', 'ejs' );
app.use(bodyParser.urlencoded({ extended: false }));
// image
app.use(express.static(__dirname+'/image')); 

// --------------- link ---------------
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/login.html'); 
});
app.get('/sign', function(req, res) {
	res.sendFile(__dirname + '/register.html');
});
app.post('/register', function(req, res){
	var new_name = req.body.new_username;
	var new_pwd = req.body.new_password ;
	var point = 50000;
	user = { username: new_name, userpassword: new_pwd, userpoint: point };

	connection.query( 'SELECT * FROM account WHERE username = ?', [new_name], function(err, result){
		if (err)
			throw err;
		if ( result.length === 0 ) {
			connection.query( 'SELECT * FROM account', function(err, result){
				if (err)
					throw err;
			})
			res.redirect('/?reg=Suc');
		}
		else
			res.redirect('/sign?ls=failed');
	});
});
app.post('/game', function (req, res) {
	var username = req.body.username ;
	var password = req.body.password ;
		connection.query( 'SELECT * FROM account WHERE username = ? and userpassword = ?', [req.body.username,req.body.password], 
    		function(err,result) {
    			if (err) {
    				throw err;
    			} 
    			if ( result.length === 0 ) {
    				res.redirect('/?ls=failed');
    			}
    			else {
					res.render( 'poker_game', { name : req.body.username,
										        point : result[0].userpoint
					});
   				}
    		} 
    	) ;

 
});
// ------------------------------------

var server = app.listen(5000, function () {
    console.log('Node server is running..');
});