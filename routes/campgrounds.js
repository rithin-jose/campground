var express = require('express');
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require('../middleware')
//INDEX - show all campgrounds
router.get("/",(req,res) => {    
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    });
    // res.render("campgrounds",{campgrounds:campgrounds});
});

//CREATE - add new campgrounds to DB
router.post("/",middleware.isLoggedIn,(req,res) => {
    //adding to array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username:req.user.username
    };
    var newCampground = {name:name,image:image,description:description,author:author};
    Campground.create(newCampground,function(err, newlyCreated){
        if(err){
            console.log(err);            
        }
        else{
            //redirect to campgrounds
            res.redirect("/campgrounds");
            console.log("created succesfully");
            
        }
    });
});

//New - Show form to createnew campground
router.get("/new",middleware.isLoggedIn,(req,res) => {
    res.render("campgrounds/new.ejs")
});

//Show - shows info about one campground
router.get("/:id",function(req,res){
    //find ground with the id and render show teplate with the details
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err || !foundCampground){
            console.log(err); 
            req.flash("error","Campground not found");
            res.redirect("back");           
        }
        else{
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});

//Edit Campgrounds Route
router.get('/:id/edit',middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){
        res.render("campgrounds/edit",{campground:foundCampground});
    });
});

//Update Campgrounds Route
router.put('/:id/edit',middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground ,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })

});

//Destroy Campgrounds Route
router.delete('/:id',middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })

});

module.exports = router;