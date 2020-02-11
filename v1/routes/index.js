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
           {  
               console.log("Error: "+ err);
               return res.send("DATABASE ERROR!!");
           }
           passport.authenticate("local")(req, res, function(){
              res.render("./auth/login"); 
           });
   });
});


//Login Routes
router.get("/login", function(req,res){
   res.render("./auth/login");
});

router.post("/login", passport.authenticate("local", {successRedirect:"/campgrounds", failureRedirect:"/login"}), function(req,res){
            res.render("./campgrounds/index"); 
        });
//====================================================//

//Logout Routes
router.get("/logout", function(req,res){
    req.logout();
   res.redirect("/login");
});
//====================================================//

module.exports = router;