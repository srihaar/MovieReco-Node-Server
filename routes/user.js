
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.login = function(req,res){
	res.render("login");
};

exports.home = function(req,res){
	res.render("home");
}

exports.store = function(req,res){
	var userId = req.param("userId");
	var type = req.param("type");
	
	req.session.userId = userId;
	req.session.type = type;
	
	console.log(req.session.userId);
	res.send({"statusCode":200});
}

exports.getData = function(req,res){
	console.log(req.session.userId);
	res.send({"userId":req.session.userId,"type":req.session.type});
}

exports.detail = function(req,res){
	console.log("am here");
	res.render("movieDetail");
}

exports.homeUser = function(req,res){
	res.render("homeUser");
}

exports.homeTag = function(req,res){
	res.render("homeTag");
}

exports.graphs = function(req,res){
	res.render("graphs");
}

exports.pieGraphs = function(req,res){
	res.render("pieGraphs");
}