const express = require("express")
const router=express.Router();
const upload = require("../config/multer");
const productModel = require("../models/product-model");
const isLoggedin = require("../middlewares/isLoggedin");

router.get("/",(req,res)=>{
    res.send("what product u want to buy")
});
router.post("/create",
    upload.single("image"),
    async (req, res) => {
         console.log(req.file);
         console.log(req.body);
    try {
        const {
            name,
            price,
            bgcolor,
            panelcolor,
            textcolor
        } = req.body;

        const product = await productModel.create({
            name: req.body.name,
            price: req.body.price,
            bgcolor: req.body.bgcolor,
            panelcolor: req.body.panelcolor,
            textcolor: req.body.textcolor,

            Image: req.file.buffer,
        });

        req.flash("success","product created successfully")
        res.redirect("/owners/admin")
    } catch (err) {
        console.log(err);
        res.send("Error creating product");
    }
});

module.exports=router;