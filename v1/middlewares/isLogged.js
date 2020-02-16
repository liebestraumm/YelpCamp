function isLogged(req, res, next){
    if(req.isAuthenticated()){
        return next();  
    }
    req.flash("error", "Please Login Mate!");
    res.redirect("/login");
}

module.exports = isLogged;
