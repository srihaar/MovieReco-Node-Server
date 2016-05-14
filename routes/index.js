
/*
 * GET home page.
 */

exports.index = function(req, res){
	
	console.log("redirect index");
  res.render('index', { title: 'Express' });
};