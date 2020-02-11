var express = require("express");
var router = express.Router({mergeParams:true});
var isLogged = require("../middlewares/isLogged")
//=================MODELS============================//
var Campground      = require("../models/campground"),
    Comment         = require("../models/comment");
//=================================================//
//===================================
//COMMENTS ROUTES
//===================================
router.get("/new",isLogged, function(req,res){
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

router.post("/", isLogged, function(req, res){
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
                    // add userbane and id to comment
                    comments.author.id = req.user._id;
                    comments.author.username = req.user.username;
                    //save comment to DB
                    comments.save();
                    campground.comments.push(comments);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id)
                   }
           });
        }
    });
})

module.exports = router;