var express 	= require("express"),
	app 		= express(),
  	bodyP 		= require("body-parser"),
  	mongoose	= require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp",  {useUnifiedTopology: true, useNewUrlParser: true});
app.use(bodyP.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.static("images"));
app.set("view engine", "ejs");

var campgroundSchema = new mongoose.Schema({
		name: String,
		image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

app.get("/", function(req, res){

	res.render("home");
});

app.get("/campgrounds", function(req, res){
	Campground.find({}, function(error, campgrounds){
		if(error){
			console.log(error);
		}
		else{
			res.render("campgrounds", {campgrounds:campgrounds})
		}
	});	
});

app.post("/campgrounds", function(req, res){

	var name = req.body.camp;
	var image = req.body.image;

	var campground = new Campground({name: name, image: image});

	campground.save(function(error, campground){
		if(error)
		{
			console.log("Error Saving: " + error);
		}
	});

	res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){

	res.render("new");
});


app.listen(3000, function(){

	console.log("Server Started");
});
