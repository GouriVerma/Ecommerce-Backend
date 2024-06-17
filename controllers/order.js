const Order=require("../models/order");
const Product = require("../models/product");
const handleAsyncError = require("../utils/asyncError");
const ErrorHandler=require("../utils/error");


const handlePlaceOrder=handleAsyncError(async(req,res,next)=>{
    if(!req.user){
        return next(new ErrorHandler("You are not authenticated", 401));

    }

    console.log(req.body);

    const {shippingDetails,orderItems,priceDetails}=req.body;
    const user=req.user._id;


    const order=await Order.create({shippingDetails,orderItems,user,priceDetails});

    
    return res.status(200).json(order);


})

const handleGetOrder = handleAsyncError(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorHandler("You are not authenticated", 401));
    }


    const _id = req.params.id;
    const order = await Order.findById(_id).populate("user","userName email");

    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

  
   //   console.log(order.user._id.toString()," ",req.user?._id.toString());
    if(req.user?.role=="ADMIN" || order.user._id.toString()===req.user?._id.toString()){
        return res.status(200).json(order);
    }

    else{
        return next(new ErrorHandler("You are not authorized", 401));
    }

});


const handleGetMyAllOrders = handleAsyncError(async (req, res, next) => {

    if(!req.user){
        return next(new ErrorHandler("You are not authenticated", 401));
    }
    const orders = await Order.find({user:req.user._id});

    let totalAmount=0;
    orders.forEach((order)=>totalAmount+=order.priceDetails?.totalPrice);
    
    return res.status(200).json({orders,totalAmount});

});

async function updateStock(id,quantity){
    const product=await Product.findById(id);
    

    product.stock-=quantity;
    await product.save({validateBeforeSave:false});


}

//Admin only
const updateOrderStatus=handleAsyncError(async (req,res,next)=>{
    const order=await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found", 404));
    }

    if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("Product is already delivered",400));
    }

    order.orderStatus=req.body?.status;

    if(req.body.status=="Delivered"){
        order.deliveredAt=Date.now();
        order.orderItems.forEach(async (orderProduct)=>{
            await updateStock(orderProduct.product,orderProduct.quantity);
        })
    }

    await order.save({validateBeforeSave:false});

    return res.status(200).json(order);

    
})

const handleDeleteOrder=handleAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found", 404));
    }

    await Order.deleteOne({_id:req.params.id});
    return res.status(200).json("Order Deleted Successfully");

})

const handleGetAllOrders=handleAsyncError(async (req,res,next)=>{
    const orders = await Order.find({});
    return res.status(200).json({orders,orderCount:orders.length});
})



module.exports={handlePlaceOrder,handleGetOrder,handleGetMyAllOrders,updateOrderStatus,handleDeleteOrder,handleGetAllOrders}