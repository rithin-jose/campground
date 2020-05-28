var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var passport = require('passport');
var LocalStratergy = require('passport-local');

var campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/comments'),
    authRoutes = require('./routes/index');

var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');
var seedDB = require('./seeds');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.set('view engine','ejs');
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

mongoose.connect("mongodb://localhost/campground",{useNewUrlParser: true, useUnifiedTopology: true});

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.use(campgroundRoutes);
app.use(commentRoutes); 
app.use(authRoutes);

app.get("*",(req,res) => {
    res.send("404 Page not found");
});

app.listen(3000,() => {
    console.log("Server listening to port 3000"); 
});