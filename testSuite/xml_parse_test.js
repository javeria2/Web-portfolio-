var assert = require('chai').assert,
	mocha = require('mocha'),
	xmlParser = require('../utils/xmlParser.js'),
  	extractInformation = require('../utils/extractInformation.js');

//data-structures for parsed XML data (lists)
var logJSON = [], listJSON = [];

//this data-structure are for holding the relevant bits
var infoList = [{}];

describe('parse xml files', function(){
	this.timeout(150000);
	it('should parse correctly', function(){
		this.timeout(150000);
		xmlParser.parse(__dirname + "/../xml/svn_log_test.xml", function(err,  log) {
			if(err) {
				assert.equal(true, false);
			}
      		this.logJSON = log["log"]["logentry"];
      		xmlParser.parse(__dirname + "/../xml/svn_list_test.xml", function(err, list) {
      			if(err) {
      				assert.equal(true, false);
      			}
        		this.listJSON = list["lists"]["list"][0]["entry"];

        		//now extract relevant bits
        		extractInformation.extractInfo(this.listJSON, this.logJSON, function(err, information){
        			if(err) {
        				assert.equal(true, false);
        			}
          			this.infoList = information;
          			console.log(this.logJSON);
    				console.log(this.listJSON);
    				console.log(this.infoList);

    				assert.equal(this.logJSON[0]['author'][0], 'javeria2');
    				assert.equal(this.listJSON[1]['name'][0], 'Assignment0/.DS_Store');
    				assert.equal(this.infoList[0]['version'], '2592');
        		});
      		});
    	});
	});
});