'use strict';
/**
 * [extractInfo - extracts information from Array]
 * @param  {[Array]}   lists    [an array of dictionaries containing list data]
 * @param  {[Array]}   logs     [an array of dictionaries containing log data]
 * @param  {Function} callback [callback function]
 * @return {[Function]}            [returned callback function]
 */
function extractInfo(lists, logs, callback){

	//an array of dictionaries to hold all the meta-data which we later process to remove duplicates
	var nonUniqueArray = [{}];

	lists.forEach(function(list) {
		 //fetch the title
		 var titleString = JSON.stringify(list["name"]).slice(2, -2);
		 var title = '';
		 var files = '';
		 if(titleString.search('/') < 0 && JSON.stringify(list['$']['kind']).slice(1,-1) === "dir")
		 	title = titleString;

		 //fetch the date
		 var date = list['commit'][0]['date'][0];
		 date = new Date(Date.parse(date));
		 date = date.toDateString();

		 //fetch the version
		 var version = list['commit'][0]['$']['revision'];

		 //fetch the commit msg
		 var msg = '';
		 logs.forEach(function(log){
		 	if(log['$']['revision'] === version) {
		 		msg = log['msg'];
		 		if(msg[0] === '') msg = "* This commit was made without a message *";
		 	}
		 });

		 //populate the dictionary and add it to the array
		 var dictionary = {
		 	'title': title,
		 	'date': date,
		 	'version': version,
		 	'msg': msg,
		 	'files': files
		 }
		 if(dictionary['title'] !== '') nonUniqueArray.push(dictionary);
	});

		if(JSON.stringify(nonUniqueArray[0]) == "{}") nonUniqueArray = nonUniqueArray.slice(1);

		//add the list of files a project contains
		nonUniqueArray = addFilesToProjects(nonUniqueArray, lists, logs);

		// remove duplicates with 'title' as the key
		nonUniqueArray = removeDuplicatesByKey(nonUniqueArray, 'title');

		return callback(null, nonUniqueArray);
};

/**
 * [removeDuplicatesByKey - removes duplicate key: value pairs from an array of dictionaries with key reference]
 * @param  {[Array]} nonUniqueArray [Array to remove duplicates from]
 * @param  {[string]} Key           [reference key]
 * @return {[Array]}               [new trimmed array]
 */
function removeDuplicatesByKey(nonUniqueArray, Key) {
  var trimmedArray = [];
  var values = [];
  var value;

  nonUniqueArray.forEach(function(entry){
  	value = entry[Key];
  	if(values.indexOf(value) === -1) {
      trimmedArray.push(entry);
      values.push(value);
    }
  });

  return trimmedArray;
}

/**
 * [addFilesToProjects - populates the dictionary objects with a new field called 'files' which contain list of files under a project and their details]
 * @param {[Array]} nonUniqueArray [Array of dictionaries]
 * @param {[Array]} lists          [new Array of dictionaries]
 * @return {[Array]} 			   [A list containing filesnames along with previous data]
 */
function addFilesToProjects(nonUniqueArray, lists, logs) {
	var filesArray = [];
	for(var i=0; i< nonUniqueArray.length; i++){
		nonUniqueArray[i]['files'] = [];
		lists.forEach(function(list){
			var fileNameString = JSON.stringify(list['name']).slice(2,-2);
			if(fileNameString.indexOf(nonUniqueArray[i]['title']) !== -1 && fileNameString !== nonUniqueArray[i]['title']) {
				nonUniqueArray[i]['files'].push({
					'title': fileNameString,
					'size': list['size'],
					'type': getFileType(fileNameString),
					'kind': JSON.stringify(list['$']['kind']).slice(1,-1),
					'versions': getFileVersions(fileNameString, logs)
				});
			}
		});

		filesArray.push(nonUniqueArray[i]);
	}

	return filesArray;
}

/**
 * [getFileType - helper function to get the type of a file]
 * @param  {[string]} fileName [directory name of the file]
 * @return {[string]}          [type of file]
 */
function getFileType(fileName) {
	var type = fileName.split('.').pop();
	if(type.search('/') >= 0) return 'inner directory';
	else if(fileName.indexOf('testSuite') != -1) return 'test file';
	else if(type === 'xml' || type === 'c' || type === 'java' || type === 'py' 
		|| type === 'html' || type === 'css') return type += ' code file';
	else if(type === 'png' || type === 'jpg' || type === 'jpeg' || type === 'svg') return type += ' image file';
	else if(type === 'pdf' || type === 'txt') return type += ' documentation';
	return type += ' resource file';
}

/**
 * [getFileVersions - gets description aboout all the versions of the commited file]
 * @param  {[String]} filename [name of the file]
 * @param  {[Array]} logs     [Array of dictionary of svn logs]
 * @return {[Array]}          [Array of dictionary of version history]
 */
function getFileVersions(filename, logs) {
	var versions = [];
	logs.forEach(function(log){
		log['paths'][0]['path'].forEach(function(givenPath){
			if(givenPath['_'] === '/javeria2/' + filename) {
				versions.push({
					'revision': log['$']['revision'],
					'author': log['author'][0],
					'msg': log['msg'][0],
					'date': new Date(Date.parse(log['date'][0])).toDateString()
				});
			}
		}); 
	});
	return versions;
}

module.exports = {
	extractInfo
}