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
		cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
			if(err){
				req.flash("error", err.message);
				return res.redirect("back");
			}
			let name = req.body.camp;
			// add cloudinary url for the image to the campground object under image property
			let image = result.secure_url;
			let description = req.body.description;
			let price   =   req.body.price;
			let author = {
				id: req.user._id,
				username: req.user.username
			}
			let imageId = result.public_id;
			var campground = new Campground({name: name, image: image, imageId: imageId,description: description, price: price, author: author});

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

//UPDATE ROUTE -- Doesn't manage Asynchronous calls. Therefore, the callback is not fully executed
// router.put("/:id/edit", checkAuthorization, upload.single('image'), function(req, res){
// 		Campground.findById(req.params.id, function(err, campgrounds){
// 			if (err){
// 				req.flash("error", err);
// 				return res.redirect("back");
// 			}
// 			else{
// 				if(req.file){
// 					cloudinary.v2.uploader.destroy(campgrounds.imageId, (err) => {
// 						if(err)
// 						{
// 							req.flash("error", err.message);
// 							return res.redirect("back");
// 						}
// 						cloudinary.v2.uploader.upload(req.file.path, function(err, result){
// 							if(err)
// 							{
// 								req.flash("error", err.message);
// 								return res.redirect("back");
// 							}
// 							else {
// 								campgrounds.image = result.secure_url;
// 								campgrounds.imageId = result.public_id;
// 							}
// 						});	
// 					});
// 				}

// 				campgrounds.name = req.body.name;
// 				campgrounds.description = req.body.description;
// 				campgrounds.price = req.body.price;
// 				campgrounds.save();
// 				req.flash("error", err.message);
// 				res.redirect("/campgrounds/"+req.params.id);
// 			}	
// 		});
	
// 	});

router.put("/:id/edit", checkAuthorization, upload.single('image'), function(req, res){
	Campground.findById(req.params.id, async function(err, campgrounds){
		if (err){
			req.flash("error", err);
			return res.redirect("back");
		}
		else{
			if(req.file){
				try{
					//Forces the execution of this method. When finished, the rest is executed
					await cloudinary.v2.uploader.destroy(campgrounds.imageId);	
					let result = await cloudinary.v2.uploader.upload(req.file.path);
					campgrounds.image = result.secure_url;
					campgrounds.imageId = result.public_id;	
				}
				catch(err){
					req.flash("error", err);
					return res.redirect("back");
				}
			}

			campgrounds.name = req.body.name;
			campgrounds.description = req.body.description;
			campgrounds.price = req.body.price;
			campgrounds.save();
			req.flash("success", "Campground Edited Succesfully");
			res.redirect("/campgrounds/"+req.params.id);
		}	
	});

});

//DELETE ROUTE
router.delete("/:id", checkAuthorization, function(req, res){
    Campground.findById(req.params.id, async function(err, campgrounds){
		if (err){
			req.flash("error", err);
			return res.redirect("back");
		}
		else
		    cloudinary.v2.uploader.destroy(campgrounds.imageId);
		campgrounds.remove();
		req.flash("success", "Campground Deleted");
		res.redirect("/campgrounds");	
    });
});
//====================================================
module.exports = router;