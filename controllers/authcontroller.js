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

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModels.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email or password is incorrect"
            });
        }

        const result = await bcrypt.compare(password, user.password);

        if (!result) {
            return res.status(401).json({
                success: false,
                message: "Email or password is incorrect"
            });
        }

        const token = generateToken(user);

        res.cookie("token", token, {
            httpOnly: true,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
            },
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};