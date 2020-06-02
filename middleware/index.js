var Campground = require("../models/campground")
var Comment = require("../models/comment")

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err,foundCampground){
            if(err || !foundCampground){
                req.flash("error","Campground not found");
                res.redirect("back");
            }else{
                
                    //mongoose obj              //string              
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You Dont have Permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","Please Login first")
        res.redirect("back");
    }
}

middlewareObj.checkCommentsOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err || !foundComment){
                req.flash("error","You do not have permission to do that")
                res.redirect("back");
            }else{
                    //mongoose obj              //string              
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","Login First")
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error","Please Login First!");
        res.redirect("/login");
    }
}

module.exports = middlewareObj;