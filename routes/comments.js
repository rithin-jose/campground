var express = require('express');
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Show comment form
router.get("/new",middleware.isLoggedIn,function(req,res){
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
router.post("/",middleware.isLoggedIn,function(req,res){
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
                    req.flash("success","Successfully added comment")
                    //redirect campground show page
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

//Edit Route
router.get("/:comment_id/edit",middleware.checkCommentsOwnership,function(req,res){
    Comment.findById(req.params.comment_id, function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{campground_id:req.params.id, comment: foundComment});
        }
    });
});

// Update Route
router.put("/:comment_id",middleware.checkCommentsOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// Destroy Route
router.delete("/:comment_id",middleware.checkCommentsOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Comment Deleted")
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports = router;