var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var campgrounds = [
    {name:"test", image:"https://pixabay.com/get/54e5dd424856ae14f1dc84609620367d1c3ed9e04e5074417d287fd39645c7_340.jpg"},
    {name:"test2", image:"https://pixabay.com/get/57e0d6424954ac14f1dc84609620367d1c3ed9e04e5074417d287fd39645c7_340.jpg"},
    {name:"test3", image:"https://pixabay.com/get/5ee1dc404c52b10ff3d8992ccf2934771438dbf852547941722b7cd59f4f_340.jpg"},
    {name:"test", image:"https://pixabay.com/get/54e5dd424856ae14f1dc84609620367d1c3ed9e04e5074417d287fd39645c7_340.jpg"},
    {name:"test2", image:"https://pixabay.com/get/57e0d6424954ac14f1dc84609620367d1c3ed9e04e5074417d287fd39645c7_340.jpg"},
    {name:"test3", image:"https://pixabay.com/get/5ee1dc404c52b10ff3d8992ccf2934771438dbf852547941722b7cd59f4f_340.jpg"},
    {name:"test", image:"https://pixabay.com/get/54e5dd424856ae14f1dc84609620367d1c3ed9e04e5074417d287fd39645c7_340.jpg"},
    {name:"test2", image:"https://pixabay.com/get/57e0d6424954ac14f1dc84609620367d1c3ed9e04e5074417d287fd39645c7_340.jpg"},
    {name:"test3", image:"https://pixabay.com/get/5ee1dc404c52b10ff3d8992ccf2934771438dbf852547941722b7cd59f4f_340.jpg"}
];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine','ejs');

app.get("/",(req,res) => {
    res.render("homepage");
});

app.get("/campgrounds",(req,res) => {
    res.render("campgrounds",{campgrounds:campgrounds});
});

app.post("/campgrounds",(req,res) => {
    //adding to array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name:name,image:image};
    campgrounds.push(newCampground);
    //redirecting the page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new",(req,res) => {
    res.render("new.ejs")
});

app.get("*",(req,res) => {
    res.send("404 Page not found");
});

app.listen(3000,() => {
    console.log("Server listening to port 3000"); 
});