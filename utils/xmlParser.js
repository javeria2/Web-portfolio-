'use strict';

var fs = require('fs'),
	xml2js = require('xml2js'),
	parser = new xml2js.Parser();

/**
 * [parse - parses a xml file to json]
 * @param  {[string]}   filename [name of the file to parse]
 * @param  {Function} callback [callback function]
 * @return {[Function]}            [returning callback function]
 */
function parse(filename, callback){
    fs.readFile(filename, function(err, data){
        if(err){
            console.log('cannot read file.');
            return callback(err);
        } else {
            parser.parseString(data, function(err, result){
                if(err) {
                   console.log('cannot parse file.');
                   return callback(err);
                }
                else {
                    return callback(null, result);
                }
            });
        }
    });
}

module.exports = {
	parse
}