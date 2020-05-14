var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost/campground",{useNewUrlParser: true, useUnifiedTopology: true});

//Schema setup
var campgroundSchema = new mongoose.Schema({
    name : String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name:"test",
//         image:"https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum voluptas et sequi quasi odio non facere nam beatae impedit, veritatis commodi ea nemo assumenda possimus, atque consequatur. Labore, ut odit."
//     },function(err, campground){
//         if(err){
//             console.log("Error");
//             console.log(err);
//         }
//         else{
//             console.log("New Campground");
//             console.log(campground);
//         }
// });

app.get("/",(req,res) => {
    res.render("homepage");
});

//INDEX - show all campgrounds
app.get("/campgrounds",(req,res) => {
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{campgrounds:allCampgrounds});
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
    res.render("new.ejs")
});

//Show - shows info about one campground
app.get("/campgrounds/:id",function(req,res){
    //find ground with the id and render show teplate with the details
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("show",{campground:foundCampground});
        }
    });
});

app.get("*",(req,res) => {
    res.send("404 Page not found");
});

app.listen(3000,() => {
    console.log("Server listening to port 3000"); 
});