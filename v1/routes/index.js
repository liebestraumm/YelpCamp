var express = require("express");
var router = express.Router();
var passport = require("passport");
//=================MODELS============================//
var User   = require("../models/user");
//=================================================//

router.get("/", function(req, res){

	res.render("./home");
});
//=================AUTHENTICATION ROUTES==============//

//Registration routes
router.get("/register", function(req,res){
   res.render("./auth/register");
});

router.post("/register", function(req,res){
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       if(err)
           {  req.flash("error", "Error: " + err);
              res.redirect("/register");
           }
           passport.authenticate("local")(req, res, function(){
              req.flash("success", "Welcome to Yelp Camp " + req.user.username);
              res.redirect("/campgrounds"); 
           });
   });
});


//Login Routes
router.get("/login", function(req,res){
   res.render("./auth/login");
});

router.post("/login", passport.authenticate("local", {successRedirect:"/campgrounds", failureRedirect:"/login"}), function(req,res){
            req.flash("error", "Campground Edited");
            res.redirect("/campgrounds"); 
        });
//====================================================//

//Logout Routes
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Logged Out!");
   res.redirect("/login");
});
//====================================================//

module.exports = router;