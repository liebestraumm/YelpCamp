var express 	= require("express"),
	app 		= express(),
  	bodyP 		= require("body-parser"),
  	mongoose	= require("mongoose");
    Campground  = require("./models/campground");
    Comment     = require("./models/comment")
    seedDB      = require("./seed")

//seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp",  {useUnifiedTopology: true, useNewUrlParser: true});
app.use(bodyP.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(express.static("images"));
app.set("view engine", "ejs");

app.get("/", function(req, res){

	res.render("./home");
});

app.get("/campgrounds", function(req, res){
	Campground.find({}, function(error, campgrounds){
		if(error){
			console.log(error);
		}
		else{
			res.render("./campgrounds/index", {campgrounds:campgrounds})
		}
	});	
});

app.post("/campgrounds", function(req, res){

	var name = req.body.camp;
	var image = req.body.image;
	var description = req.body.description;
	var campground = new Campground({name: name, image: image, description: description});

	campground.save(function(error, campground){
		if(error)
		{
			console.log("Error Saving: " + error);
		}
	});

	res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){

	res.render("./campgrounds/new");
});

app.get("/campgrounds/:id", function(req, res){
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


//===================================
//COMMENTS ROUTES
//===================================
app.get("/campgrounds/:id/comments/new", function(req,res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            
            res.render("./comments/new", {campground: campground})
        }
    } )
});

app.post("/campgrounds/:id/comments", function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err)
            console.log(err);
        else{
           Comment.create(req.body.comments, function(err, comments){
               if(err)
                   console.log(err)
               else
                   {
                    campground.comments.push(comments);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id)
                   }
           });
        }
    });
})

app.listen(3000, function(){

	console.log("Server Started");
});
