const Order=require("../models/order");
const Product = require("../models/product");
const handleAsyncError = require("../utils/asyncError");
const ErrorHandler=require("../utils/error");

async function updateStock(id,quantity){
    const product=await Product.findById(id);
    

    product.stock-=quantity;
    await product.save({validateBeforeSave:false});


}


const handlePlaceOrder=handleAsyncError(async(req,res,next)=>{
    if(!req.user){
        return next(new ErrorHandler("You are not authenticated", 401));

    }

    console.log(req.body);

    const {shippingDetails,orderItems,priceDetails}=req.body;
    const user=req.user._id;


    const order=await Order.create({shippingDetails,orderItems,user,priceDetails});
    orderItems.forEach(async(orderProduct)=>await updateStock(orderProduct.product,orderProduct.quantity))
    

    
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



//Admin only
const updateOrderStatus=handleAsyncError(async (req,res,next)=>{
    const order=await Order.findById(req.params.id);
    const orderProductId=req.query?.orderProductId;

    

    if(!order){
        return next(new ErrorHandler("Order not found", 404));
    }

    if(!orderProductId){
        return next(new ErrorHandler("Order Product Id not given",400));
    }

    const orderProduct=order.orderItems.find((orderProduct)=>orderProduct._id==orderProductId);
    if(!orderProduct){
        return next(new ErrorHandler("Order Product not found", 404));
    }

    if(orderProduct.orderStatus==="Delivered"){
        return next(new ErrorHandler("Product is already delivered",400));
    }


    if(req.body?.status=="Shipped"){
        orderProduct.orderStatus=req.body?.status;
        orderProduct.shippedAt=new Date();
        
      //  await updateStock(orderProduct.product,orderProduct.quantity);
        
    }
    else if(req.body?.status=="Delivered"){
        orderProduct.orderStatus=req.body?.status;
        orderProduct.deliveredAt=new Date();
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