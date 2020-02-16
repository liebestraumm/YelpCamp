var express = require("express");
var router = express.Router({mergeParams:true});
var isLogged = require("../middlewares/isLogged");
var checkAuthorizationComments = require("../middlewares/checkAuthorizationComments");
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
                   {
                    req.flash("error", "Something Went Wrong!");
                    console.log(err)
                   }
               else
                   {
                    // add userbane and id to comment
                    comments.author.id = req.user._id;
                    comments.author.username = req.user.username;
                    //save comment to DB
                    comments.save();
                    campground.comments.push(comments);
                    campground.save();
                    req.flash("success", "Successfully added!");
                    res.redirect("/campgrounds/" + campground._id)
                   }
           });
        }
    });
})

//EDIT ROUTES
router.get("/:comment_id/edit", checkAuthorizationComments, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
   });
});

//UPDATE ROUTE
router.put("/:comment_id/edit", checkAuthorizationComments, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comments, function(err){
        if(err)
            res.send(err)
        res.redirect("/campgrounds/"+req.params.id);
    });
})

//DELETE ROUTE
router.delete("/:comment_id", checkAuthorizationComments, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, camp){
       req.flash("success", "Comment Deleted");
       res.redirect("/campgrounds/"+req.params.id);
    });
});

module.exports = router;