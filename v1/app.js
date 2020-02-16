//=================NODE MODULES=====================+/
var express 	    = require("express"),
	app 		    = express(),
    method          = require("method-override");
  	bodyP 		    = require("body-parser"),
  	mongoose	    = require("mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    flash           = require("connect-flash"),
    old             = {};
//==================================================//
//=================MODELS============================//
    User            = require("./models/user"),
//=================================================//
//====================ROUTES========================//
    campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index"),
//====================================================//
    //SEEDER  FILE
    seedDB          = require("./seed");
var id = "";
//seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp",  {useUnifiedTopology: true, useNewUrlParser: true});
app.use(bodyP.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(express.static("images"));
app.set("view engine", "ejs");
app.use(method("_method"));
app.use(flash());

//===========SETTING AUTHENTICATION VARIABLES======//
//Initializing express-session module.
app.use(require("express-session")({
    secret: "Carlos",
    resave: false,
    saveUninitialized: false
}));

//Initializing Passport moodule and initializing sesison.
app.use(passport.initialize());
app.use(passport.session());

//Adding serializers and deserializers
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//===================================================

//Global variables shared by templates
app.use(function(req,res,next){
    res.locals.currentUser = req.user,
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.old = {};
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function(){

	console.log("Server Started");
});
