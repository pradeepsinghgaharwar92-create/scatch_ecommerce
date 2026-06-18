const express = require("express")
const app = express()

const cookieParser =require("cookie-parser");
const path =require("path");
const router=express.Router();
const expressSession=require("express-session");
const flash=require("connect-flash");

require("dotenv").config();

const ownersRouters = require("./routes/ownersRouters")
const productRouters = require("./routes/productRouters")
const userRouter = require("./routes/userRouters")
const isLoggedin = require("./middlewares/isLoggedin")



const db =require("./config/mongoose-connection");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(
    expressSession({
        resave:false,
        saveUninitialized:false,
        secret:process.env.EXPRESS_SESSION_SECRET,
    })
)
app.use(flash());
app.use(express.static(path.join(__dirname,"public")))
app.set("view engine","ejs");

app.use("/owners", ownersRouters);
app.use("/products",productRouters);
app.use("/users", userRouter);

app.use("/", require("./routes/index"));

app.use((req,res,next)=>{
    res.locals.isLoggedin = !!req.cookies.token;
    next();
});

app.get("/", (req, res) => {
    res.render("index", { error: "" });
});

app.listen(5000,()=>{
    console.log("server started")
});