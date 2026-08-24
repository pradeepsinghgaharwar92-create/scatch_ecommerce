const express = require("express")
const router = express.Router();
const upload = require("../config/multer");
const productModel = require("../models/product-model");
const isLoggedin = require("../middlewares/isLoggedin");

const formatProduct = (product) => {
    if (!product) return null;
    const productObj = product.toObject ? product.toObject() : product;
    if (productObj.Image && Buffer.isBuffer(productObj.Image)) {
        productObj.Image = `data:image/jpeg;base64,${productObj.Image.toString("base64")}`;
    }
    return productObj;
};

router.get("/", (req, res) => {
    res.send("what product u want to buy")
});
router.post("/create",
    upload.single("image"),
    async (req, res) => {
        console.log("CREATE PRODUCT REQUEST:", req.file, req.body);
        try {
            const {
                name,
                price,
                discount,
                bgcolor,
                panelcolor,
                textcolor
            } = req.body;

            const product = await productModel.create({
                name,
                price,
                discount: discount || 0,
                bgcolor,
                panelcolor,
                textcolor,
                Image: req.file ? req.file.buffer : undefined,
            });

            return res.status(201).json({
                success: true,
                message: "Product created successfully",
                product: formatProduct(product)
            });
        } catch (err) {
            console.error("PRODUCT CREATION ERROR:", err);
            return res.status(500).json({
                success: false,
                message: "Error creating product: " + err.message
            });
        }
    });

module.exports = router;