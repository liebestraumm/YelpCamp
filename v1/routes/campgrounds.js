var express = require("express");
var router = express.Router();
var isLogged = require("../middlewares/isLogged");
//=================MODELS============================//
var Campground      = require("../models/campground");
//=================================================//
//===================CAMPGROUNDS ROUTES===============//
router.get("/", function(req, res){
	Campground.find({}, function(error, campgrounds){
		if(error){
			console.log(error);
		}
		else{
			res.render("./campgrounds/index", {campgrounds:campgrounds});
		}
	});	
});

router.post("/", isLogged, function(req, res){

	var name = req.body.camp;
	var image = req.body.image;
	var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
	var campground = new Campground({name: name, image: image, description: description, author: author});

	campground.save(function(error, campground){
		if(error)
		{
			console.log("Error Saving: " + error);
		}
        else
            console.log(campground);
	});

	res.redirect("/campgrounds");
});

router.get("/new", isLogged, function(req, res){

	res.render("./campgrounds/new");
});

router.get("/:id", function(req, res){
    //find the campground with provided ID
		Campground.findById(req.params.id).populate("comments").exec(function(error, found){
			if(error)
				console.log(error);
			else{
                console.log(found);
				res.render("./campgrounds/show", {campground: found});
			}
		});	
});

//====================================================
module.exports = router;