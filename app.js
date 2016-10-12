//include the modules
var express = require('express'),
	app = express(),
	ejs = require('ejs'),
	xmlParser = require('./utils/xmlParser.js'),
  bodyparser = require('body-parser'),
  extractInformation = require('./utils/extractInformation.js');

//save the pain of writing .ejs after each render
app.set("view engine","ejs");

//lookup js and css in public directory __dirname refers to current dir
app.use(express.static(__dirname + "/public"));

//data-structures for parsed XML data (lists)
var logJSON = [], listJSON = [];

//this data-structure are for holding the relevant bits
var infoList = [{}];

//initial page counter
var initCounter = 0;

//description for each project
app.get('/portfolio/:name/:id', function(req, res){
  if(initCounter === 0) {
    res.redirect('/');
  } else {
    res.render('info', {
      name: req.params.name,
      id: req.params.id,
      infoList: this.infoList
    });
  }
});

//portfolio route
app.get('/portfolio', function(req, res, next){
    initCounter = 1;
    //first step, parse xml file to JSON
    xmlParser.parse(__dirname + "/xml/svn_log.xml", function(err,  log) {
      this.logJSON = log["log"]["logentry"];
      xmlParser.parse(__dirname + "/xml/svn_list.xml", function(err, list) {
        this.listJSON = list["lists"]["list"][0]["entry"];

        //now extract relevant bits
        extractInformation.extractInfo(this.listJSON, this.logJSON, function(err, information){
          this.infoList = information;
          next();
        });
      });
    });

    console.log("middleware was executed!");
},
  //callback function 
  function(req, res){
    res.render('portfolio', {
    	infoList: this.infoList
    });
});


//root route
app.get('/', function(req, res){
	res.render('homepage');
});

//start the server on localhost with port 3000
app.listen(process.env.PORT || 3000, function(){
	console.log('server started!');
});