var request         = require("request"),
    express         = require("express"),
    bodyParser      = require("body-parser"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    flash           = require("connect-flash"),
    methodOverride  = require("method-override"),
    User            = require("./models/user"),
    app             = express(),
    mongoose        = require("mongoose"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comments"),
    seedDB          = require("./seeds")
    
//requring routes
var commentRoutes     = require("./routes/comments"),
    campgroundRoutes  = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index")
    
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost/YelpCamp");
app.set("view engine","ejs");
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Federer is the best tennis player in the world",
    resave:false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
   
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(process.env.PORT, process.env.IP,function(){
    console.log("Server has started!!");   
});