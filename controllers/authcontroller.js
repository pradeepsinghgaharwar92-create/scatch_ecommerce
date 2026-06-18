const userModels = require("../models/user-models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const generateToken = require("../utils/generatetoken");
const shop = require("../routes/index")



// module.exports.registerUser =async(req,res)=>{
    
//    try{
//      let{fullname,gmail,password}=req.body;

//     let user=await userModels.create({
//         fullname,
//         password,
//         gmail,
//     });
//     let token=generateToken(user);
//     res.cookie("token",token)
//     res.send('token created succesfully')
//    }
//    catch(err){;
//    console.log(err.message)}
// } 

module.exports.loginUser= async(req,res)=>{
     let{email,password}=req.body;

     let user = await userModels.findOne({email:email});
     if(!user) return res.send('email or password is incorect');

     bcrypt.compare(password,user.password,function(err,result){
        if(result){
            let token=generateToken(user)
            res.cookie("token",token)
            
            res.redirect("/shop")
        }
        else{
            return res.send('email or password is incorect');
        }
     })
}