var express = require("express");
var bodyParser = require("body-parser");
var list = require("./models/read-labels.js");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());


//ROOT DOMAIN REQUEST
app.get("/", function(req, res) {
	res.send("Newslater root path");
});

//GET /labels
app.get("/labels", function(req, res) {
	console.log(list);
	res.json(list);
});

//LISTEN TO REQUESTS
app.listen(PORT, function() {
		console.log("Express listening on port " + PORT + "!");
});