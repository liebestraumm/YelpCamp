var Campground = require("../models/campground")
var Comments = require("../models/comment")

function checkAuthorizationComments(req, res, next) {
 if(req.isAuthenticated()){
        Comments.findById(req.params.comment_id, function(err, comment){
           if(err || !comment){
               req.flash("error", "Comment not found");
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(comment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "Permission Denied");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "No Authorization");
        res.redirect("back");
    }
}

module.exports = checkAuthorizationComments;