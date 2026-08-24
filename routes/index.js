const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const productModel = require("../models/product-model");
const userModels = require("../models/user-models");

const formatProduct = (product) => {
    if (!product) return null;
    const productObj = product.toObject ? product.toObject() : product;
    if (productObj.Image && Buffer.isBuffer(productObj.Image)) {
        productObj.Image = `data:image/jpeg;base64,${productObj.Image.toString("base64")}`;
    }
    return productObj;
};

router.get("/", function(req, res){
    return res.status(200).json({ message: "Scatch API is active" });
});

router.get("/search", isLoggedin, async function(req, res){
    try {
        let query = req.query.query || "";
        let products = await productModel.find({
            name: { $regex: query, $options: "i" }
        });
        const formatted = products.map(formatProduct);
        return res.status(200).json(formatted);
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/shop", isLoggedin, async function(req, res){
    try {
        console.log("SHOP ROUTE HIT");
        let products = await productModel.find();
        const formatted = products.map(formatProduct);
        return res.status(200).json(formatted);
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/cart", isLoggedin, async function(req, res){
    try {
        let user = await userModels
            .findOne({ email: req.user.email })
            .populate("cart.product");
            
        let bill = 0;
        let cartItems = [];

        if (user && user.cart) {
            cartItems = user.cart.map(item => {
                if (item.product) {
                    const formattedProd = formatProduct(item.product);
                    bill += formattedProd.price * item.quantity;
                    return {
                        product: formattedProd,
                        quantity: item.quantity,
                        _id: item._id
                    };
                }
                return null;
            }).filter(item => item !== null);
        }

        return res.status(200).json({
            cartItems,
            bill
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

router.post("/product/:id/review", isLoggedin, async function(req, res){
    try {
        let product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        let user = await userModels.findOne({
            email: req.user.email
        });

        product.reviews.push({
            user: user._id,
            rating: req.body.rating,
            comment: req.body.comment
        });

        await product.save();
        
        // Return updated product details
        const updatedProduct = await productModel.findById(req.params.id).populate("reviews.user");
        return res.status(200).json({
            success: true,
            message: "Review added successfully",
            product: formatProduct(updatedProduct)
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/product/:id", isLoggedin, async function(req, res){
    try {
        let product = await productModel
            .findById(req.params.id)
            .populate("reviews.user");
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json(formatProduct(product));
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/buynow/:id", isLoggedin, async function(req, res){
    try {
        let product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json(formatProduct(product));
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/addtocart/:productid", isLoggedin, async function(req, res){
    try {
        let user = await userModels.findOne({
            email: req.user.email
        });

        let existingItem = user.cart.find(
            item => item.product.toString() === req.params.productid
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cart.push({
                product: req.params.productid,
                quantity: 1
            });
        }

        await user.save();
        return res.status(200).json({ success: true, message: "Added to cart", cartLength: user.cart.length });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/clearcart", isLoggedin, async function(req, res){
    try {
        let user = await userModels.findOne({
            email: req.user.email
        });

        user.cart = [];
        await user.save();

        return res.status(200).json({ success: true, message: "Cart Cleared" });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/cart/increase/:id", isLoggedin, async function(req, res){
    try {
        let user = await userModels.findOne({
            email: req.user.email
        });

        let item = user.cart.find(
            item => item.product.toString() === req.params.id
        );

        if (item) {
            item.quantity += 1;
        }

        await user.save();
        return res.status(200).json({ success: true, message: "Quantity increased" });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/cart/decrease/:id", isLoggedin, async function(req, res){
    try {
        let user = await userModels.findOne({
            email: req.user.email
        });

        let item = user.cart.find(
            item => item.product.toString() === req.params.id
        );

        if (item && item.quantity > 1) {
            item.quantity -= 1;
        }

        await user.save();
        return res.status(200).json({ success: true, message: "Quantity decreased" });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/profile", isLoggedin, async function(req, res){
    try {
        let user = await userModels.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                contact: user.contact,
                cartLength: user.cart.length,
                ordersLength: user.orders?.length || 0,
                isadmin: user.isadmin || false
            }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/logout", function(req, res){
    res.clearCookie("token");
    return res.status(200).json({ success: true, message: "Logged out successfully" });
});

module.exports = router;