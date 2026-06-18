const express = require("express");
const router=express.Router();
const userModels = require("../models/user-models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const generateToken = require("../utils/generatetoken");
const { loginUser } = require("../controllers/authcontroller");


router.get("/",(req,res)=>{
    
    res.send("heyyyy")
})
router.post("/register",async(req,res)=>{
     try{
         let{fullname,email,password}=req.body;
         let hashedPassword = await bcrypt.hash(password, 10);
    
        let user=await userModels.create({
            fullname,
            password:hashedPassword,
            email,
        });
        console.log("REGISTERED USER:", user)

        let token=generateToken(user);
        res.cookie("token",token)
        res.redirect("/")
       }
       catch(err){;
       console.log(err.message)}
    
});

router.post("/login",loginUser)


module.exports=router;