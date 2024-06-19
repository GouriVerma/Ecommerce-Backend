const express=require("express");
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const cookieParser=require("cookie-parser");
const cors = require('cors')

const PORT=process.env.PORT || 8000




//Uncaught error exception
process.on("uncaughtException",(err)=>{
    console.log(err.message);
    console.log("Shutting down server due to uncaught exception");
    process.exit(1); //1 is status code
})


dotenv.config();



//router
const productRouter=require("./routes/product");
const authRouter=require("./routes/auth");
const userRouter=require("./routes/user");
const orderRouter=require("./routes/order");
const paymentRouter=require("./routes/payment");

//middlewares
const handleError=require("./middleware/error");
const { checkAuth } = require("./middleware/auth");


const app=express();

//connect to mongo
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log(err));

//middleware
app.use(express.json());
app.use(checkAuth);
app.use(cookieParser());
app.use(cors());




//routes
app.use("/api/product",productRouter);
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/order",orderRouter);
app.use("/api/payment",paymentRouter);


//errorHandler middleware to handle cast error
app.use(handleError);


app.listen(PORT,()=>console.log(`Server started at ${PORT}`));