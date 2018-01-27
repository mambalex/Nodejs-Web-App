var express   = require("express");
var router    = express.Router();
var User      = require("../models/user");
var passport  = require("passport");

//root route
router.get("/", function(req,res){
    res.render("landing");
 
});


//Auth routes

//show register form
router.get("/register", function(req, res) {
    res.render("register");
});


//handle sign up post
router.post("/register", function(req, res) {
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password,function(err,user){
       if(err){
           console.log(err);
           req.flash("error", err.message);
           return res.render("register");
       }
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
       
   });
});


//Login Routes
router.get("/login",function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),function(req,res){
});


//Logout Route
router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success","logged you out!");
    res.redirect("/campgrounds");
})



module.exports = router;