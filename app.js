//include the modules
var express = require('express'),
	app = express(),
	ejs = require('ejs'),
  xmlParser = require('./utils/xmlParser.js'),
	tester = require('./utils/testComment.js'),
  bodyparser = require('body-parser'),
  extractInformation = require('./utils/extractInformation.js'),
  mysql = require('mysql');

//save the pain of writing .ejs after each render
app.set("view engine","ejs");

//lookup js and css in public directory __dirname refers to current dir
app.use(express.static(__dirname + "/public"));

//req will now contain a new object called 'body'
app.use(bodyparser.urlencoded({extended: true}));

//connect to the database
var connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'sanchay',
  database:'portfolio',
  multipleStatements: false
});
connection.connect();


//data-structures for parsed XML data (lists)
var logJSON = [], listJSON = [];

//this data-structure are for holding the relevant bits
var infoList = [{}];

//this data-structure will hold the relevant formatted comment
var comment = '';

//initial page counter
var initCounter = 0;


//add a new comment for each project (new comment route)
app.get('/portfolio/:name/:id/new/:commentid', function(req, res){
  var comment_parent = req.params.commentid;

  if(initCounter === 0) {
    res.redirect('/');
  } else {
    res.render('comment', {
      name: req.params.name,
      id: req.params.id,
      comment_parent: comment_parent
    });
  }
});

//description for each project (project description route)
app.get('/portfolio/:name/:id', function(req, res){
  if(initCounter === 0) {
    res.redirect('/');
  } else {
    var passInfoList = this.infoList;
    connection.query('select * from comments where parent_project_id = ' + connection.escape(req.params.id), function(err, result){
      if(err) {
        console.log(err);
        return;
      }
        res.render('info', {
          name: req.params.name,
          id: req.params.id,
          infoList: passInfoList,
          comments: result
        });
    });
  }
});

//description for each project (post route for comments)
app.post('/portfolio/:name/:id/:comment_parent', function(req, res, next) {
    this.comment = req.body.comment;
    //first filter the comment of bad words
    tester.testComment(this.comment, function(err, result){
      this.comment = result;
      next();
    });
},
//callback function
function(req, res){
    var parent = req.params.comment_parent;
    if(parent == 'null') {
      parent = 0;
    }
    var new_comment = {
      parent_project_id: req.params.id,
      comment_body: this.comment,
      comment_parent: parent
    };
    var query = connection.query('insert into comments set ?', new_comment, function(err, result){
      if(err) {
        console.log(err);
        return;
      } else {
        res.redirect('/portfolio/' + req.params.name + '/' + req.params.id);
      }
    });
});

//portfolio route (project listing route)
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