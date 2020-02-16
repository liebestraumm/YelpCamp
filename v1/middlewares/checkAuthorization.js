var Campground = require("../models/campground")

function checkAuthorization(req, res, next) {
 if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err || !foundCampground){
               req.flash("error", "Campground not found!");
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "Permission Denied");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "No Authentication");
        res.redirect("/campgrounds");
    }
}

module.exports = checkAuthorization;