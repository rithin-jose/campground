var express = require('express');
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Show comment form
router.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);            
        }
        else{
            res.render("comments/new",{campground: campground});
        }
    });
});

//Comment post
router.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
    //lookup campground using id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }
        else{
           
            //create new comment
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err); 
                }
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    
                    //redirect campground show page
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

// middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/login")
    }
}

module.exports = router;