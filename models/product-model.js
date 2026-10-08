
const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    rating: {
        type: Number,
        required: true
    },

    comment: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const productSchema = mongoose.Schema({
    Image: {
        type: Buffer,
        required: true
    },

    imageContentType: {
        type: String,
        default: "image/jpeg"
    },
    name: String,
    price: Number,
    category: String,
    discount: {
        type: Number,
        default: 0,
    },
    bgcolor: String,
    panelcolor: String,
    textcolor: String,
    reviews: [reviewSchema],
})

module.exports = mongoose.model("product", productSchema);