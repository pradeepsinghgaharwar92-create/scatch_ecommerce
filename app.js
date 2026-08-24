require("dotenv").config();
const express = require("express")

const app = express()

const cookieParser =require("cookie-parser");
const path =require("path");
const router=express.Router();
const expressSession=require("express-session");


const ownersRouters = require("./routes/ownersRouters")
const productRouters = require("./routes/productRouters")
const userRouter = require("./routes/userRouters")
const isLoggedin = require("./middlewares/isLoggedin")



const db =require("./config/mongoose-connection");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
console.log("SESSION SECRET =", process.env.EXPRESS_SESSION_SECRET);
app.use(
    expressSession({
        resave:false,
        saveUninitialized:false,
        secret:"mysecretkey123",
    })
)
app.use(express.static(path.join(__dirname,"public")))

app.use("/owners", ownersRouters);
app.use("/products",productRouters);
app.use("/users", userRouter);

app.use("/", require("./routes/index"));

app.listen(5000,()=>{
    console.log("server started")
});