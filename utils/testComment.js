//setup the database
var mysql = require('mysql');

var connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'sanchay',
  database:'portfolio',
  multipleStatements: false
});
connection.connect();


/**
 * [testComment this function replaces bad_words in the comment with good_words]
 * @param  {[String]}   comment  [comment to be tested]
 * @param  {Function} callback [callback to be returned]
 * @return {[Function]}            [callback function]
 */
function testComment(comment, callback) {
	var words = comment.split(" "); //splits words in array of words by delimeter (space)
	var wordsProcessed = 0;
	var res = comment;
	words.forEach(function(word, i){
		(function(index){
			connection.query('select good_words from words where bad_words = ' + connection.escape(word), function(err, result){
				if(err){
					console.log(err);
					return callback(err);
				}
				wordsProcessed++;
				if(result.length != 0){
					res = res.replace(word, result[0].good_words);
				}
				if(wordsProcessed >= words.length){
            		return callback(null, res);
        		}
			});
		})(i);
	});
}

module.exports = {
	testComment
}
