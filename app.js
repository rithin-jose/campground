var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var passport = require('passport')
var LocalStratergy = require('passport-local')

var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');
var seedDB = require('./seeds');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.set('view engine','ejs');
seedDB();

//Passport config
app.use(require('express-session')({
    secret:"The secret is used to hash the session with HMAC, So you can put anything in here.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost/campground",{useNewUrlParser: true, useUnifiedTopology: true});

app.get("/",(req,res) => {
    res.render("homepage");
});

// *******************************************************************************
//                          Campground routes
// *******************************************************************************

//INDEX - show all campgrounds
app.get("/campgrounds",(req,res) => {
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
app.post("/campgrounds",(req,res) => {
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
app.get("/campgrounds/new",(req,res) => {
    res.render("campgrounds/new.ejs")
});

//Show - shows info about one campground
app.get("/campgrounds/:id",function(req,res){
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

// *******************************************************************************
//                          Comments routes
// *******************************************************************************

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);            
        }
        else{
            res.render("comments/new",{campground: campground});
        }
    });
});
app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
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
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect campground show page
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

// *******************************************************************************
//                          Authentication routes
// *******************************************************************************
app.get("/register",function(req,res){
    res.render('register');
});
app.post("/register",function(req,res){
    User.register(new User({username: req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
});

app.get("/login",function(req,res){
    res.render("login")
});

app.post("/login",passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),function(req,res){
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds")
});


// *******************************************************************************
//                          middleware
// *******************************************************************************
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/login")
    }
}

// *******************************************************************************
//                          Error routes and port config
// *******************************************************************************

app.get("*",(req,res) => {
    res.send("404 Page not found");
});

app.listen(3000,() => {
    console.log("Server listening to port 3000"); 
});