const express = require("express")
const router=express.Router();
const ownerModel = require("../models/owner-model");
const isLoggedin = require("../middlewares/isLoggedin");


router.post("/create",async(req,res)=>{
    let {fullname,gmail,password}=req.body;

    let createdOwner = await ownerModel.create({
            fullname,
            gmail,
            password,
        })

    res.status(201).send("createdOwner")
});

router.get("/admin",function(req,res){
    res.render("createproducts", {
        isLoggedin:false,
    success: req.flash("success")
})
});


module.exports=router;






