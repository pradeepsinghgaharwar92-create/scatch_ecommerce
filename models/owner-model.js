const { name } = require("ejs");
const mongoose = require("mongoose");

const ownerSchema=mongoose.Schema({
   Image:String,
   name:String,
   password:String,
   product:{
    type:Array,
    default:[],
   },
   
})

module.exports=mongoose.model("owner",ownerSchema);