var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user') ;

//Root Route
router.get("/",(req,res) => {
    res.render("homepage");
});

//Signup Route
router.get("/register",function(req,res){
    res.render('register');
});
router.post("/register",function(req,res){
    User.register(new User({username: req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            req.flash("error",err.message);
            res.redirect("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to Campground " +user.username);
            res.redirect("/campgrounds");
        });
    });
});

//Shows Login Route
router.get("/login",function(req,res){
    res.render("login")
});

//Handles Login Route
router.post("/login",passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),function(req,res){
});

// Logout route
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out")
    res.redirect("/campgrounds")
});

module.exports = router;