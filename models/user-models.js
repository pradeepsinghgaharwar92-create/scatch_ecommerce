const mongoose = require("mongoose");


const userSchema=new mongoose.Schema({
    fullname:String,
    email:String,
    password:String,
    contact:Number,
    picture:String,
    cart: [
   {
      product: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "product"
      },
      quantity: {
         type: Number,
         default: 1,
      }
   }
],
    isadmin:Boolean,
     orders:{
        type:Array,
        default:[],
    }
})

module.exports=mongoose.model("user",userSchema);