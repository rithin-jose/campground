var express = require('express');
var router = express.Router();
var Campground = require("../models/campground");

//INDEX - show all campgrounds
router.get("/campgrounds",(req,res) => {    
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
router.post("/campgrounds",(req,res) => {
    //adding to array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name:name,image:image,description:description};

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
router.get("/campgrounds/new",(req,res) => {
    res.render("campgrounds/new.ejs")
});

//Show - shows info about one campground
router.get("/campgrounds/:id",function(req,res){
    //find ground with the id and render show teplate with the details
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }
        else{
            console.log("found");
            
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});

module.exports = router;