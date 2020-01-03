var express = require("express");
var app = express();
var bodyP = require("body-parser");

app.use(bodyP.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.static("images"));
app.set("view engine", "ejs");

var campImages = [
	{name: "Avila", image: "Avila.png"},
	{name: "La Sabanita", image: "La_Sabanita.png"},
	{name: "Gesundbrunnen", image: "Wansee.png"}
];

app.get("/", function(req, res){

	res.render("home");
});

app.get("/campgrounds", function(req, res){

	res.render("campgrounds", {campImages:campImages});
});

app.post("/campgrounds", function(req, res){

	res.render("campgrounds", {campImages:campImages});
});

app.get("/campgrounds/new", function(req, res){

	res.render("new", {campImages:campImages});
});

app.listen(3000, function(){

	console.log("Server Started");
});
