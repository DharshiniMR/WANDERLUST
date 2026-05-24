const { saveRedirectUrl } =require("../middleware.js");
const express=require('express');
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const User=require("../models/user");
const passport=require("passport");
const userController=require("../controllers/users.js");

router
   .route("/signup")
   .get(userController.renderSignupForm)//SIGNUP
   .post(wrapAsync(userController.signup));


router
   .route("/login")
   .get(userController.loginrenderForm)//LOGIN
   .post(saveRedirectUrl,passport.authenticate('local',
     { failureRedirect: '/login',
        failureFlash:true }),
       userController.login );


router.get("/logout",userController.logout);

module.exports=router;