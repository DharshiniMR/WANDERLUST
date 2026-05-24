const express=require('express');
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError")
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage });


router
    .route("/")
    .get(wrapAsync(listingController.index)) //INDEX ROUTE
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing));//Update created Listing 
    
//ADD NEW LISTING
router.get("/new",isLoggedIn,listingController.renderNewForm);

router  
    .route("/:id")
    .get(wrapAsync(listingController.showListings))//SHOW ROUTE
    .put(isLoggedIn,upload.single('listing[image]'),isOwner,wrapAsync(listingController.updateListing))//Update edited listing
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));//DELETE/DESTROY LISTING

//EDIT LISTING
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))



module.exports=router;