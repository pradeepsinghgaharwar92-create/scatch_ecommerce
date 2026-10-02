require("dotenv").config();
const express = require("express")
const cors = require("cors");

const app = express()
const PORT = process.env.PORT || 5000;

const cookieParser =require("cookie-parser");
const path =require("path");
const router=express.Router();
const expressSession=require("express-session");

app.use(cors({
     origin: [
       "http://localhost:5173",
       "scatch-ecommerce.vercel.app"
    ],
    credentials: true
}));


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
        secret: process.env.EXPRESS_SESSION_SECRET || "development-secret",
    })
)
app.use(express.static(path.join(__dirname,"public")))

app.use("/owners", ownersRouters);
app.use("/products",productRouters);
app.use("/users", userRouter);

app.use("/", require("./routes/index"));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});