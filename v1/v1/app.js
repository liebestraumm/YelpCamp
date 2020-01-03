var express = require("express");
var app = express();
var body = require("body-parser");

app.set("view engine", "ejs");
app.use(express.static("images"));
app.use(express.static("public"));
app.use(body.urlencoded({extended:true}));

	var campgrounds = [
	{name: "Salmon Creek", image: "https://pixabay.com/get/55e8dc404f5aab14f6da8c7dda793f7f1636dfe2564c704c72287cdd954fc251_340.jpg"},
	{name: "La Sabanita", image: "https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c72287cdd954fc251_340.jpg"},
	{name: "Jardin Botanico", image: "camp.png"}
	];

app.get("/", function(req, res){

	res.render("home");

});

app.get("/campgrounds", function(req, res){


	res.render("campgrounds", {campgrounds:campgrounds});

});

app.post("/campgrounds", function(req, res){

	var name = req.body.name;
	var image = req.body.image;
	var newCampGround = {name: name, image:image};
	campgrounds.push(newCampGround);
	res.redirect("/campgrounds");

});

app.get("/campgrounds/new", function(req, res){

	res.render("new");

});


app.listen(3000, function(){

	console.log("Server Started");
});