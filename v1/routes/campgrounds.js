var express = require("express");
var router = express.Router();
var isLogged = require("../middlewares/isLogged");
var checkAuthorization = require("../middlewares/checkAuthorization");
//=================MODELS============================//
var Campground      = require("../models/campground");
//=================================================//
router.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});
//===================CAMPGROUNDS ROUTES===============//
router.get("/", function(req, res){
	Campground.find({}, function(error, campgrounds){
		if(error){
            req.flash("error", "Something Went Wrong!");
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
    var price   =   req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
	var campground = new Campground({name: name, image: image, description: description, price: price, author: author});

	campground.save(function(error, campground){
		if(error)
		{   req.flash("error", "Something Went Wrong with Database!");
			console.log("Error Saving: " + error);
		}
//        else
//            console.log(campground);
	});
    req.flash("success", "New Campground Created!");
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
//                console.log(found);
				res.render("./campgrounds/show", {campground: found});
			}
		});	
});

//EDIT ROUTES
router.get("/:id/edit", checkAuthorization, function(req, res){
    Campground.findById(req.params.id, function(err, foundCamp){
        old = foundCamp;
        res.render("./campgrounds/edit", {campground: foundCamp});
    });
});

//UPDATE ROUTE
router.put("/:id/edit", checkAuthorization, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campgrounds, function(err){
        if (err)
            req.flash("error", err)
        if(req.body.campgrounds.name !== old.name) {
            req.flash("success", "Campground Edited");
        }
        res.redirect("/campgrounds/"+req.params.id);
    });
})

//DELETE ROUTE
router.delete("/:id", checkAuthorization, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, camp){
       req.flash("error", "Campground Removed");
       res.redirect("/campgrounds");
    });
});
//====================================================
module.exports = router;