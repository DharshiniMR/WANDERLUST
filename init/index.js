const mongoose=require("mongoose");
const Listing=require("../models/listing");
const initData =require("./data.js");

main().then(()=>{
    console.log("Connection successful");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

}
const  initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"6a0f1c94be604cb3a1aec418"}));
    await Listing.insertMany(initData.data);
    console.log("Data Initialized");
}
initDB();