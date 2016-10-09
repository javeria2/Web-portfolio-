//include the modules
var express = require('express'),
	app = express(),
	ejs = require('ejs'),
	xmlParser = require('./utils/xmlParser.js'),
	promise = require('promise');

//save the pain of writing .ejs after each render
app.set("view engine","ejs");

// app.get('/portfolio', function(req, res, next){
// 	var log = xmlParser.parse(__dirname + "/xml/svn_log.xml");
// 	new promise(function (fulfill, reject){
// 		log.done(function(res){
// 			try{
// 				fulfill(res);
// 				logJSON = res;
// 				// console.log(logJSON);
// 				// res.render('portfolio', {logJSON: logJSON});
// 				req.logJSON = res;
// 			} catch(exception) {
// 				reject(exception);
// 			}
// 		}, reject);
// 	});
// 	next();	
// }, function(req, res){
// 	console.log(req.logJSON);
// 	res.render('portfolio', {logJSON: req.logJSON});
// });

var listJSON, logJSON;

app.get('/portfolio', function(req, res, next){
    xmlParser.parse(__dirname + "/xml/svn_log.xml", listJSON, function() {
      xmlParser.parse(__dirname + "/xml/svn_list.xml", logJSON, next);
    });
    console.log("middleware was excuted!");
}, function(req, res){
    console.log(listJSON);
});

app.get('/', function(req, res){
	res.render('homepage');
});

//start the server
app.listen('3000', '127.0.0.1', function(){
	console.log('server started!');
});