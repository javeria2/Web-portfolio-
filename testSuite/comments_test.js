var assert = require('chai').assert,
	mocha = require('mocha'),
	tester = require('../utils/testComment.js'),
	mysql = require('mysql');

var connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'sanchay',
  database:'portfolio',
  multipleStatements: false
});
connection.connect();

//test saving and retreiving of comments on the database
describe('comments', function(){
	this.timeout(140000);
	it('should be stored correctly', function(done){
		this.timeout(140000);
		setTimeout(function(){
			done();
		}, 140000);
		var new_comment = {
	      parent_project_id: 1,
	      comment_body: "this is a test comment",
	      comment_parent: 0
    	};
    	var query = connection.query('insert into comments set ?', new_comment, function(err, result){
      		if(err) {
        		return done(err);
      		} else {
        		connection.query('select * from comments where comment_body = \'this is a test comment\'', function(err, result){
      				if(err) {
				        return done(err);
      				}
			        assert.equal(result[0].parent_project_id, 1);
			        assert.equal(result[0].comment_parent, 0);
			        assert.equal(result[0].comment_body, 'this is a test comment');
			        done();
    			});
      		}
    	});

	});
});

//test replying to comments
describe('comments', function(){
	this.timeout(140000);
	it('should be replied to correctly', function(done){
		this.timeout(140000);
		setTimeout(function(){
			done();
		}, 140000);
		var new_comment = {
	      parent_project_id: 1,
	      comment_body: "this is a test reply comment",
	      comment_parent: 104
    	};
    	var query = connection.query('insert into comments set ?', new_comment, function(err, result){
      		if(err) {
        		return done(err);
      		} else {
        		connection.query('select * from comments where comment_id = 104', function(err, result){
      				if(err) {
				        return done(err);
      				}
			        assert.equal(result[0].parent_project_id, 1);
			        assert.equal(result[0].comment_parent, 0);
			        assert.equal(result[0].comment_body, 'this is a test comment');
			        done();
    			});
      		}
    	});

	});
});

//test filtering of comments
describe('comments', function(){
	this.timeout(140000);
	it('should be filtered correctly', function(done){
		this.timeout(140000);
		setTimeout(function(){
			done();
		}, 140000);
		tester.testComment('fuck off mate!', function(err, result){
      		assert.equal(result, 'fudge off mate!');
      		done();
    	});

	});
});

//test malicious comment injection
describe('comments', function(){
	this.timeout(140000);
	it('should be safe from injections', function(done){
		this.timeout(140000);
		setTimeout(function(){
			done();
		}, 140000);
		connection.query('select * from comments where comment_id = 104; drop table comments;', function(err, result){
			if(err) {
	        return done();
			}
		});

	});
});