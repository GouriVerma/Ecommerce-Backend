const {validateAccessToken}=require("../service/auth");
const ErrorHandler = require("../utils/error");
const handleAsyncError=require("../utils/asyncError");

const checkAuth=(req,res,next)=>{
    req.user=null;
    const authHeader=req.headers?.authorization;
    if(!authHeader){
        return next()
        
    }
    
    const token=authHeader.split("Bearer ")[1];
    try {
        const result=validateAccessToken(token);
        // console.log("result",result);
        
        req.user=result;
        console.log("user",req.user);
        
    } catch (error) {
        
        console.log("Error: Token expired!!!");
    }
    next();
}

const restrictToAuth=handleAsyncError(async (req,res,next)=>{
    const token=req.cookies?.token;
    if(!token){
        next(new ErrorHandler("Token not present",401));
    }

    const payload=validateAccessToken(token);
    console.log("payload in restrictToAuth",payload);
    req.user=result;


})

const restrictTo=(roles)=>(req,res,next)=>{
    const authHeader=req.headers?.authorization;
    if(!authHeader){
        return next(new ErrorHandler("You are not authenticated",401));
        
    }
    
    const token=authHeader.split("Bearer ")[1];
    try {
        const decodeUser=validateAccessToken(token);
        if(!roles.includes(decodeUser.role)){
            return next(new ErrorHandler(`role ${decodeUser.role} is not authenticated`,403));
        }
        
        req.user=decodeUser;
        console.log("user",req.user);
        
    } catch (error) {
        
        return next(new ErrorHandler("You are not authenticated",401));
    }
    next();
}

module.exports={checkAuth,restrictTo};