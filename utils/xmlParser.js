var fs = require('fs'),
	xml2js = require('xml2js'),
	parser = new xml2js.Parser(),
	promise = require('promise');

// function parse(filename){
// 	return new promise(function (fulfill, reject){
// 	    fs.readFile(filename, function (err, data){
// 	      if (err){
// 			console.log('cannot read file.');
// 	      	reject(err);
// 	      }
// 	      else {
// 	      	parser.parseString(data, function(err, result){
// 				if(err) console.log('cannot parse file.');
// 				else {
// 	      			fulfill(result);
// 				}
// 			});
// 	      }
// 	    });
//   	});
// }

function parse(filename, outputJSON, callback){
    fs.readFile(filename, function(err, data){
        if(err){
            console.log('cannot read file.');
            return callback();
        } else {
            parser.parseString(data, function(err, result){
                if(err) {
                   console.log('cannot parse file.');
                   return callback();
                }
                else {
                    outputJSON = result;
                    console.log('finished parsing!');
                    return callback();
                }
            });
        }
    });
}

module.exports = {
	parse
}