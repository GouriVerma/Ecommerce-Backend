const User=require("../models/user");
const handleAsyncError=require("../utils/asyncError");
const ErrorHandler = require("../utils/error");


const handleGetMyAllAddresses=handleAsyncError(async(req,res,next)=>{
    if(!req.user){
        return next(new ErrorHandler("You are not logged in",401));
    }

    if(req.user._id.toString()!==req.params.id.toString()){
        return next(new ErrorHandler("You can view only your saved adresses",403));
    }

    const user=await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    return res.status(200).json(user.savedAddresses);
})


const handleAddNewAddress=handleAsyncError(async(req,res,next)=>{
    
    if(!req.user){
        return next(new ErrorHandler("You are not logged in",401));
    }
    const {name,email,phone,houseAddress,areaAddress,pinCode,city,state,country}=req.body;
    
    console.log(req.user._id," ",req.params.id);
    if(req.user._id.toString()!==req.params.id.toString()){
        return next(new ErrorHandler("You can add address to your id only",403));
    }

    const id=req.user?._id;
    const user=await User.findById(id);
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    user.savedAddresses.push({name,email,phone,houseAddress,areaAddress,pinCode,city,state,country});
    user.save({validateBeforeSave:false});

    return res.status(200).json(user.savedAddresses);


})

const handleDeleteAddress=handleAsyncError(async(req,res,next)=>{
    if(!req.user){
        return next(new ErrorHandler("You are not logged in",401));
    }

    if(req.user._id.toString()!==req.params.id.toString()){
        return next(new ErrorHandler("You can add item to your cart only",403));
    }
    
    const id=req.user?._id;

    const savedAddressId=req.query?.savedAddressId;

    if(!savedAddressId){
        return next(new ErrorHandler("Address ID missing",400));
    }

    const user=await User.findById(id);
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    const savedAddresses=user.savedAddresses.filter((address)=>address._id.toString()!==savedAddressId.toString());
    console.log(savedAddresses);
    user.savedAddresses=savedAddresses;
    user.save({validateBeforeSave:true});

    return res.status(200).json({success:true,adresses:user.savedAddresses});


})

const handleUpdateAddress=handleAsyncError(async(req,res,next)=>{
    console.log(req.user);
    if(!req.user){
        return next(new ErrorHandler("You are not logged in",401));
    }

    

    console.log(req.user._id.toString());
    console.log(req.params.id.toString());

    if(req.user._id.toString()!==req.params.id.toString()){
        return next(new ErrorHandler("You can add item to your cart only",403));
    }

    const id=req.user?._id;
    const user=await User.findById(id);
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    const savedAddressId=req.query?.savedAddressId;

    if(!savedAddressId){
        return next(new ErrorHandler("Address ID missing",404));
    }
    const {name,email,phone,houseAddress,areaAddress,pinCode,city,state,country}=req.body;

    const isAddressExist=user.savedAddresses.find((address)=>address._id.toString()===savedAddressId.toString());
    if(!isAddressExist){
        return next(new ErrorHandler("Address not found",404));
    }



    user.savedAddresses.forEach((address)=>{
        if(address._id.toString()===savedAddressId.toString()){
            address.name=name;
            address.email=email;
            address.phone=phone;
            address.houseAddress=houseAddress;
            address.areaAddress=areaAddress;
            address.pinCode=pinCode;
            address.city=city;
            address.state=state;
            address.country=country;

        }
    })

    
    user.save({validateBeforeSave:true});
    return res.status(200).json({success:true,savedAddresses:user.savedAddresses});

})




module.exports={handleGetMyAllAddresses,handleAddNewAddress,handleDeleteAddress,handleUpdateAddress}