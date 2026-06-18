const express=require("express");
const router=express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const productModel=require("../models/product-model");
const userModels = require("../models/user-models");

router.get("/",function(req,res){
    let error=req.flash("error")
    res.render("index",{error,
        isLoggedin: false
    });
});
router.get("/search",isLoggedin,async function(req,res){
    let query = req.query.query
      let products = await productModel.find({
        name: { $regex: query, $options: "i" }  // regex ka mtlv jo hamne search kiya usse related jo bhi ho dedo
    });

    res.render("shop", {
        products,
        success: [],
        isLoggedin: true
    });
})


router.get("/shop",isLoggedin,async function(req,res){
    console.log("SHOP ROUTE HIT");
   
    let products = await productModel.find();
     
    res.render("shop", { products,success:req.flash("success"),isLoggedin: true });
});

// yaha hamne cart vala route banaya 
router.get("/cart", isLoggedin, async function(req,res){

    let user = await userModels
        .findOne({email:req.user.email})
        .populate("cart.product");
        
        let bill = 0;

    user.cart.forEach(item => {
        bill += item.product.price * item.quantity;
    });
        

    res.render("cart",{
        cartItems:user.cart,
        bill,
        isLoggedin: true,
       
    });

});

router.post("/product/:id/review", isLoggedin, async function(req, res){

    let product = await productModel.findById(req.params.id);

    let user = await userModels.findOne({
        email: req.user.email
    });

    product.reviews.push({
        user: user._id,
        rating: req.body.rating,
        comment: req.body.comment
    });

    await product.save();

    res.redirect("/product/" + req.params.id);
});

router.get("/product/:id",isLoggedin,async function(req,res){
       let product = await productModel
        .findById(req.params.id)
        .populate("reviews.user");
    res.render("productdetails",{product,isLoggedin: true})

})
router.get("/buynow/:id",isLoggedin,async function(req,res){
    let product = await productModel.findById(req.params.id);
   res.render("buynow",{isLoggedin: true,product})
});

// yaha hamne product ko add kiya
router.get("/addtocart/:productid", isLoggedin, async function(req,res){

    let user = await userModels.findOne({
        email: req.user.email
    });

    let existingItem = user.cart.find(
        item => item.product.toString() === req.params.productid
    );

    if(existingItem){
        existingItem.quantity += 1;
    }else{
        user.cart.push({
            product: req.params.productid,
            quantity: 1
        });
    }

    await user.save();

    req.flash("success","Added to cart");
    res.redirect("/shop");
});
router.get("/clearcart", isLoggedin, async function(req,res){

    let user = await userModels.findOne({
        email:req.user.email
    });

    user.cart = [];

    await user.save();

    res.send("Cart Cleared");
});
// yaha hamne + vale ko working banaya
router.get("/cart/increase/:id", isLoggedin, async function(req,res){

    let user = await userModels.findOne({
        email: req.user.email
    });

    let item = user.cart.find(
        item => item.product.toString() === req.params.id
    );

    if(item){
        item.quantity += 1;
    }

    await user.save();

    res.redirect("/cart");
});
// yaha hamne - vale ko working banaya
router.get("/cart/decrease/:id", isLoggedin, async function(req,res){

    let user = await userModels.findOne({
        email: req.user.email
    });

    let item = user.cart.find(
        item => item.product.toString() === req.params.id
    );

    if(item && item.quantity > 1){
        item.quantity -= 1;
    }

    await user.save();

    res.redirect("/cart");
});


// yaha hamne profile banayi 
router.get("/profile",isLoggedin,async function(req,res){
   let user=await userModels.findOne({email:req.user.email})
   res.render("profile",{user,isLoggedin: true})
});

router.get("/logout", function(req,res){
    res.clearCookie("token");
    req.flash("success", "Logged out successfully");
    res.redirect("/");
});



module.exports=router