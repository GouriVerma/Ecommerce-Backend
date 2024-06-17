const User=require("../models/user");
const crypto=require("crypto")
const handleAsyncError = require("../utils/asyncError");
const { deleteRefreshToken, createAccessToken, createRefreshToken,validateRefreshToken } = require("../service/auth");
const ErrorHandler = require("../utils/error");
const sendEmail=require("../utils/sendEmail")

const handleUserSignUp=handleAsyncError(async (req,res,next)=>{
    const {userName,email,password}=req.body;
    const cartItems=[];
    const savedAddresses=[];
    const user=await User.create({userName,email,password,cartItems,savedAddresses});
    return res.status(200).json(user);

})

const handleUserLogIn=handleAsyncError(async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){
        next(new ErrorHandler("Please enter all fields",400));
    }

    const userInfo=await User.matchPasswordAndGenerateToken(email,password);
    return res.status(200).cookie("token",userInfo.accessToken,{expire:new Date()+process.env.COOKIE_EXPIRE*24*60*60*1000,httpOnly:true}).json(userInfo);
})

const handleRefresh=handleAsyncError(async (req,res,next)=>{
    const {refreshToken}=req.body;
    console.log(req.body);
    // console.log(refreshToken);
    if(!refreshToken){
        return next(new ErrorHandler("You are not logged in",401));
    }

    const payload=validateRefreshToken(refreshToken);
    const user=await User.findById(payload._id);

    //deleteRefreshToken
    deleteRefreshToken(refreshToken);

    //create new
    const newAccessToken=createAccessToken(user);
    const newRefreshToken=createRefreshToken(user);

    return res.status(200).json({newRefreshToken,newAccessToken});

})

const handleLogout=handleAsyncError((req,res,next)=>{
    const {refreshToken}=req.body;

    if(req.user){
        deleteRefreshToken(refreshToken);
        return res.status(200).json("Logged out successfully");
    }
    else{
        return res.status(401).json("Already logged out");
    }
    
   
})

const handleForgotPassword=handleAsyncError(async (req,res,next)=>{
    const {email}=req.body;
    if(!email){
        return next(new ErrorHandler("Please enter email",400));
    }

    const user=await User.findOne({email});
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    const resetToken=user.getResetPasswordToken();

    await user.save({validateBeforeSave:true}); //save because resetToken is generated in method but it is not yet saved

    const url=`${req.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`

    const options={
        email:user.email,
        message: `Please click on ${url} to reset password \n\n Ignore mail if not requested` ,
        subject:`Email Recovery Ecommerce`
    }

    try {

        await sendEmail(options);
        res.status(200).json(`Email sent to ${user.email} successfully`)
        
    } catch (error) {
        this.resetPasswordToken=undefined;
        this.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:true});
        return next(new ErrorHandler(error.message,500))
    }
})


const handleResetPassword=handleAsyncError(async (req,res,next)=>{
    
    
    const hashedResetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");
    console.log(req.params.token);
    const user=await User.findOne({resetPasswordToken:hashedResetPasswordToken, resetPasswordExpire:{$gt:Date.now()}});
    if(!user){
        return next(new ErrorHandler("Reset Password Token in invalid or has expired",400));
    }

    const {password,confirmPassword}=req.body;
    console.log(password," ",confirmPassword);
    if(password!==confirmPassword){
        return next(new ErrorHandler("Password doesn't match",400));
    }

    

    user.password=password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined

    await user.save();

    const accessToken=createAccessToken(user);
    const refreshToken=createRefreshToken(user);  
    const result= {_id:user._id,userName:user.userName,email:user.email,password,accessToken,refreshToken};
    return res.status(200).cookie("token",accessToken,{expire:new Date()+process.env.COOKIE_EXPIRE*24*60*60*1000,httpOnly:true}).json(result);


    


})

module.exports={handleUserSignUp,handleUserLogIn,handleRefresh,handleLogout,handleForgotPassword,handleResetPassword}
