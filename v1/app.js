var express = require("express");
var app = express();
var bodyP = require("body-parser");

app.use(bodyP.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.static("images"));
app.set("view engine", "ejs");

app.get("/", function(req, res){

	res.render("home");
});

app.listen(3000, function(){

	console.log("Server Started");
});
