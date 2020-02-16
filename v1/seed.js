var express 	= require("express");
var app = express();

app.use(express.static("images"))
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment")

var data = [
    {
        name: "El Avila",
        image: "/avila.png",
        description: "El avila magica"
    },
    {
        name: "La Sabanita",
        image: "/La_Sabanita.png",
        description: "La sabana de Bocono"
    },
    {
        name: "Wansee Lake",
        image: "/Wansee.png",
        description: "I Love Berlin"
    }
]
function seedDB(){
    //Remove all campgrounds
    Campground.remove({}, function(err){
//    if(err)
//        console.log(err);
//    console.log("removed campgrounds");
//    //add campgrounds
//    data.forEach(function(seed){
//        Campground.create(seed, function(err, campground){
//            if(err)
//                console.log(err);
//            else{
//                console.log("added a compground");
//                //Create a comment
//                Comment.create({
//                    text: "This place is great",
//                    author: "Carlos"
//                }, function(err, comment){
//                    if(err)
//                        console.log(err)
//                    else 
//                    {
//                    campground.comments.push(comment);
//                    campground.save();
//                    console.log("Comment created")
//                    }
//                });
//            }
//        });
//    })
        
        Comment.remove({}, function(err){});
});
    
}

module.exports = seedDB;