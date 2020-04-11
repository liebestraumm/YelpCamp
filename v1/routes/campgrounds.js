var express  			= require("express"),
	multer				= require("multer"),
	cloudinary			= require("cloudinary"),
	isLogged 			= require("../middlewares/isLogged"),
	checkAuthorization 	= require("../middlewares/checkAuthorization"),
	router 				= express.Router();
require('dotenv').config();
//ENV Variables
const API_K = process.env.API_K,
	  API_S = process.env.API_S,
	  NAME  = process.env.NAME;
//=================MODELS============================//
var Campground      = require("../models/campground");
//=================================================//
//Authenticate User
router.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

//==================================SETTING UP MODULES========================================//
//--Multer:
//Creates Disk Storage and sets names of images to be upload using date and name of the image
var storage = multer.diskStorage({
	filename: function(req, file, callback) {
	  callback(null, Date.now() + file.originalname);
	}
  });

//Filters the image. Validates that the the file to be uploaded is an image. If not, returns an error.
var imageFilter = function (req, file, cb) {
	  // accept image files only
	  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
		  return cb(new Error('Only image files are allowed!'), false);
	  }
	  cb(null, true);
  };

//Uploads image to server using properties configured above
var upload = multer({ storage: storage, fileFilter: imageFilter})


//--Cloudinary: This creates a storage server for the images in the cloud.
cloudinary.config({ 
  cloud_name: NAME, 
  api_key: API_K, 
  api_secret: API_S
});

//======================================================//
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

router.post("/", isLogged, upload.single('image'), function(req, res){
		cloudinary.uploader.upload(req.file.path, function(result) {
			let name = req.body.camp;
			// add cloudinary url for the image to the campground object under image property
			let image = result.secure_url;
			let description = req.body.description;
			let price   =   req.body.price;
			let author = {
				id: req.user._id,
				username: req.user.username
			}
			var campground = new Campground({name: name, image: image, description: description, price: price, author: author});

			campground.save(function(error, campground){
				if(error)
				{   req.flash("error", "Something Went Wrong with Database!");
					console.log("Error Saving: " + error);
					return res.redirect("back");
				}
		//        else
		//            console.log(campground);
			});
			req.flash("success", "New Campground Created!");
			res.redirect("/campgrounds");
		});
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