var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var flash = require("connect-flash");
var passport = require('passport');
var LocalStratergy = require('passport-local');
var methodOverride = require('method-override');

var campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/comments'),
    authRoutes = require('./routes/index');


var User = require('./models/user');
var seedDB = require('./seeds');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.set('view engine','ejs');
app.use(methodOverride('_method'));
app.use(flash());
// uncomment to seed the DB
// seedDB();

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

mongoose.connect("mongodb://localhost/campground",{useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false});

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes); 
app.use("/",authRoutes);

app.get("*",(req,res) => {
    res.send("404 Page not found");
});

app.listen(3000,() => {
    console.log("Server listening to port 3000"); 
});