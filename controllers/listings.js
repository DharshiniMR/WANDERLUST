const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient  = mbxGeocoding({ accessToken:mapToken });

//INDEX ROUTE
module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};
//ADD NEW LISTING
module.exports.renderNewForm=(req,res)=>{
    res.render('listings/new.ejs');
   
};
//Update created Listing 
module.exports.createListing=async(req,res,next)=>{
    let response=await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()
    
    
    let url=req.file.path;
    let filename=req.file.filename;
   
    const newListing=new Listing(req.body.listing);
    //console.log(req.user);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    let savedListing=await newListing.save();
    //console.log(savedListing);
    req.flash("success","New Listing Created!");
    res.redirect("/listing");
    
}
//SHOW ROUTE
module.exports.showListings=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).
    populate('reviews')
    .populate("owner")
    .populate(
        {path:"reviews",
            populate:{path:"author"},
        });
        
    if(!listing){
        req.flash("error","Listing you requested for doesn't exist!");
        return res.redirect("/listing")
    }
    res.render("listings/show.ejs",{listing});
}
//EDIT LISTING
module.exports.renderEditForm=async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for doesn't exist!");
        return res.redirect("/listing")
    }
    let originalImgUrl=listing.image.url;
    originalImgUrl=originalImgUrl.replace("/upload","/upload/h_150,w_250/");
    //console.log(originalImgUrl);
    res.render("listings/edit.ejs",{listing,originalImgUrl});
}
//Update edited listing
module.exports.updateListing=async(req,res)=>{
    let { id } = req.params; 
    if(!req.body.listing){
        throw new ExpressError(400,"Send Valid Data For Listing");
    }
    
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!= 'undefined'){
        let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();

    }
    
    req.flash("success","Changes made successfully!");
    res.redirect(`/listing/${id}`);
}
//DELETE/DESTROY LISTING
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listing");
}