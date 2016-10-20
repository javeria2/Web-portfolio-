var assert = require('chai').assert,
  	mocha = require('mocha'),
  	xmlParser = require('../utils/xmlParser.js'),
    extractInformation = require('../utils/extractInformation.js');

//data-structures for parsed XML data (lists)
var logJSON = [], listJSON = [];

//this data-structure are for holding the relevant bits
var infoList = [{}];

//test parsing of file
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

    				assert.equal(this.logJSON[0]['author'][0], 'javeria2');
    				assert.equal(this.listJSON[1]['name'][0], 'Assignment2.0/CSAir');
    				assert.equal(this.infoList[0]['version'], '6194');
    				done();
        		});
      		});
    	});
	});
});
