var assert = require('chai').assert,
  mocha = require('mocha'),
  xmlParser = require('../utils/xmlParser.js'),
    extractInformation = require('../utils/extractInformation.js');

//data-structures for parsed XML data (lists)
var logJSON = [], listJSON = [];

//this data-structure are for holding the relevant bits
var infoList = [{}];

// test multiple commits of same file and multiple commits of different files
describe('parse xml files', function(){
	this.timeout(140000);
	it('should parse correctly', function(done){
		this.timeout(140000);
		setTimeout(function(){
			done();
		}, 140000);
		xmlParser.parse(__dirname + "/../xml/svn_log_test.xml", function(err,  log) {
			if(err) {
				return done(err);
			}
      		this.logJSON = log["log"]["logentry"];
      		xmlParser.parse(__dirname + "/../xml/svn_list_test.xml", function(err, list) {
      			if(err) {
      				return done(err);
      			}
        		this.listJSON = list["lists"]["list"][0]["entry"];

        		//now extract relevant bits
        		extractInformation.extractInfo(this.listJSON, this.logJSON, function(err, information){
        			if(err) {
        				return done(err);
        			}
    				this.infoList = information;
    				assert.equal(this.infoList[0]['files'][2]['versions'][0]['revision'], '6838');
    				assert.equal(this.infoList[0]['files'][2]['versions'][1]['revision'], '6839');
    				assert.equal(this.infoList[0]['files'][3]['versions'][0]['msg'], '2.0 first');
    				assert.equal(this.infoList[0]['files'][3]['versions'][1]['msg'], '2.0');
    				done();
        		});
      		});
    	});
          			
	});
});