const User=require("../models/user");
const Product=require("../models/product");
const handleAsyncError=require("../utils/asyncError");
const ErrorHandler = require("../utils/error");


const handleGetAllCartItems=(handleAsyncError(async(req,res,next)=>{
    if(!req.user){
        return next(new ErrorHandler("You are not logged in",401));
    }

    if(req.user._id.toString()!==req.params.id.toString()){
        return next(new ErrorHandler("You can view only your cart items",403));
    }

    const user=await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    return res.status(200).json(user.cartItems);
}))


const handleAddToCart=handleAsyncError(async(req,res,next)=>{
    
    if(!req.user){
        return next(new ErrorHandler("You are not logged in",401));
    }
    const {name,newPrice,oldPrice,discount,quantity,size,product,image,brand,avgRating}=req.body;
   
    

    if(req.user._id.toString()!==req.params.id.toString()){
        return next(new ErrorHandler("You can add item to your cart only",403));
    }

    const id=req.user?._id;
    const user=await User.findById(id);
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    user.cartItems.push({name,newPrice,oldPrice,discount,quantity,size,product,image,brand,avgRating});
    user.save({validateBeforeSave:false});

    return res.status(200).json(user.cartItems);


})

const handleDeleteFromCart=handleAsyncError(async(req,res,next)=>{
    if(!req.user){
        return next(new ErrorHandler("You are not logged in",401));
    }

    if(req.user._id.toString()!==req.params.id.toString()){
        return next(new ErrorHandler("You can add item to your cart only",403));
    }

    console.log(req.query);
    
    const id=req.user?._id;

    const cartProductId=req.query?.cartProductId;

    if(!cartProductId){
        return next(new ErrorHandler("Missing Cart Product ID",400));
    }

    const user=await User.findById(id);
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    const cartItems=user.cartItems.filter((item)=>item._id.toString()!==cartProductId.toString());
    // console.log(cartItems);
    user.cartItems=cartItems;
    user.save({validateBeforeSave:false});

    return res.status(200).json({cart:user.cartItems,success:true});


})

const handleUpdateItemInCart=handleAsyncError(async(req,res,next)=>{
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

    const cartProductId=req.query?.cartProductId;

    if(!cartProductId){
        return next(new ErrorHandler("Cart Item not found",404));
    }
    const {size,quantity}=req.body;

    const isProductExist=user.cartItems.find((item)=>item._id.toString()===cartProductId.toString());
    if(!isProductExist){
        return next(new ErrorHandler("Cart Item not found",404));
    }



    user.cartItems.forEach((item)=>{
        if(item._id.toString()===cartProductId.toString()){
            item.size=size;
            item.quantity=quantity;
        }
    })

    
    user.save({validateBeforeSave:false});
    return res.status(200).json({success:true,cart:user.cartItems});

})

const handleDeleteCartItems=handleAsyncError(async(req,res,next)=>{
    if(!req.user){
        return next(new ErrorHandler("You are not logged in",401));
    }

    const user=await User.findById(req.user._id);
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    user.cartItems=[];
    user.save({validateBeforeSave:false});
    return res.status(200).json(user);


})

module.exports={handleAddToCart,handleDeleteFromCart,handleUpdateItemInCart,handleGetAllCartItems,handleDeleteCartItems}